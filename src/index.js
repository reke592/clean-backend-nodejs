const { CLUSTER_SIZE, SERV_PORT } = require("./startup/environment");
const server = require("./server");
const { logger } = require("./helpers/logging");

// better to use cluster module to take advantage of multi-core systems
// downside is that it's a bit more complex to manage and TLS is not supported
// if we need to support TLS, we need to use a reverse proxy like nginx
// if we need socket.io, we need to use sticky sessions or redis or socket.io-redis for ipc between workers
// if we implement caching, we need to use a shared cache like redis or node-cache (the problem with node-cache is that it's in-memory)
const cluster = require("cluster").default || require("cluster");

/**
 * Number of online workers
 */
let onlineWorkers = 0;

/**
 * Gracefully shutdown the server
 * @param {*} signal
 * @returns
 */
const gracefulShutdown = (signal) => () => {
  if (cluster.isPrimary) {
    logger.info(`Received ${signal}. Shutting down gracefully.`);

    let timeout = 10;
    logger.info(
      `Waiting for ${onlineWorkers} worker/s to shutdown. timeout: ${timeout}s`
    );

    for (const id in cluster.workers) {
      cluster.workers[id].kill(signal);
    }

    setInterval(() => {
      timeout -= 1;
      if (timeout === 0) {
        logger.info("Forcing shutdown");
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
    logger.info(
      `${CLUSTER_SIZE} is greater than available CPUs ${numCPUs}. Using ${numCPUs} instead`
    );
  }

  for (let i = 0; i < Math.min(CLUSTER_SIZE, numCPUs); i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    logger.info(
      `Worker PID ${worker.process.pid} is online, listening on port ${SERV_PORT}`
    );
    onlineWorkers++;

    // start crons when all workers are online
    if (onlineWorkers === Math.min(CLUSTER_SIZE, numCPUs)) {
      require("./crons");
    }
  });

  cluster.on("exit", (worker, code, signal) => {
    logger.info(
      `Worker PID ${worker.process.pid} exited with code ${code}, signal ${signal}`
    );
    onlineWorkers--;
  });

  process.on("SIGTERM", gracefulShutdown("SIGTERM"));
  process.on("SIGINT", gracefulShutdown("SIGINT"));
} else {
  server.listen(SERV_PORT);
}
