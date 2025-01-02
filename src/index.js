const {
  CLUSTER_SIZE,
  SERV_PORT,
  CRON_AS_DAEMON,
} = require("./startup/environment");
const server = require("./server");
const { logger } = require("./helpers/logging");

// better to use cluster module to take advantage of multi-core systems
// downside is that it's a bit more complex to manage and TLS is not supported
// if we need to support TLS, we need to use a reverse proxy like nginx
// if we need socket.io, we need to use sticky sessions or redis or socket.io-redis for ipc between workers
// if we implement caching, we need to use a shared cache like redis or node-cache (the problem with node-cache is that it's in-memory)
const cluster = require("cluster").default || require("cluster");
const child_process = require("child_process");

/**
 * Number of online workers
 */
let onlineWorkers = 0;

/**
 * @type {child_process.ChildProcess[]} list of subprocesses
 */
const children = [];

/**
 * start a child process, automatically respawn if needed
 * @param {*} script filename
 * @param {*} enable flag to enable the child process
 */
const startChild = (script, enable, respawn = true) => {
  if (enable) {
    let child = child_process.fork(script);
    child.on("spawn", () => {
      logger.info(`PID ${child.pid} spawned, script: ${script}`);
    });
    child.on("exit", (code) => {
      children.pop(child);
      if (code != 0 && respawn) {
        logger.warn(`PID ${child.pid} exited with code ${code}, respawning..`);
        child = child_process.fork(script);
        children.push(child);
      }
    });
  } else {
    logger.warn(`${script} is disabled`);
  }
};

/**
 * Gracefully shutdown the server
 * @param {*} signal
 * @returns
 */
const gracefulShutdown = (signal) => () => {
  if (cluster.isPrimary) {
    logger.warn(`Received ${signal}. Shutting down gracefully.`);

    let timeout = 10;
    logger.warn(
      `Waiting for ${onlineWorkers} worker/s to shutdown. timeout: ${timeout}s`
    );

    // for old node versions, we need to propagate the kill signal to workers and subprocesses
    for (const id in cluster.workers) {
      cluster.workers[id].kill(signal);
    }

    for (const child of children) {
      child.kill(signal);
    }

    setInterval(() => {
      timeout -= 1;
      if (timeout === 0) {
        logger.warn("Forcing shutdown");
        process.exit(1);
      } else if (onlineWorkers === 0) {
        process.exit(0);
      }
    }, 1000);
  } else {
    server.close(() => {
      process.exit(0);
    });
  }
};

if (cluster.isPrimary) {
  const numCPUs = require("os").cpus().length;
  logger.info(`Master PID ${process.pid} is running`);

  if (CLUSTER_SIZE > numCPUs) {
    logger.warn(
      `${CLUSTER_SIZE} is greater than available CPUs ${numCPUs}. Using ${numCPUs} instead`
    );
  }

  for (let i = 0; i < Math.min(CLUSTER_SIZE, numCPUs); i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    logger.info(
      `PID ${worker.process.pid} is online, listening on port ${SERV_PORT}`
    );
    onlineWorkers++;

    // start subprocesses when all workers are online
    if (onlineWorkers === Math.min(CLUSTER_SIZE, numCPUs)) {
      startChild("./src/crons", CRON_AS_DAEMON);
    }
  });

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(
      `PID ${worker.process.pid} exited with code ${code}, signal ${signal}`
    );
    onlineWorkers--;

    // attempt to respawn the worker
    if (!signal && code == 1) {
      logger.warn("respawn worker");
      cluster.fork();
    }
  });

  process.on("SIGTERM", gracefulShutdown("SIGTERM"));
  process.on("SIGINT", gracefulShutdown("SIGINT"));
  process.on("exit", (code) => {
    logger.warn(`Master PID ${process.pid} exited with code ${code}`);
  });
} else {
  server.listen(SERV_PORT);
}
