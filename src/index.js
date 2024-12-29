require("./startup");

// better to use cluster module to take advantage of multi-core systems
// downside is that it's a bit more complex to manage and TLS is not supported
// if we need to support TLS, we need to use a reverse proxy like nginx
// if we need socket.io, we need to use sticky sessions or redis or socket.io-redis for ipc between workers
// if we implement caching, we need to use a shared cache like redis or node-cache (the problem with node-cache is that it's in-memory)
const cluster = require("cluster");
const server = require("./server");

let onlineWorkers = 0;

const gracefulShutdown = (signal) => () => {
  if (cluster.isMaster) {
    console.log(`Received ${signal}. Shutting down gracefully.`);

    let timeout = 10;
    console.log(
      `Waiting for ${onlineWorkers} worker/s to shutdown. timeout: ${timeout}s`
    );

    for (const id in cluster.workers) {
      cluster.workers[id].kill(signal);
    }

    setInterval(() => {
      timeout -= 1;
      if (timeout === 0) {
        console.log("Forcing shutdown");
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

if (cluster.isMaster) {
  const numCPUs = require("os").cpus().length;
  console.log(`Master PID ${process.pid} is running`);

  if (process.env.CLUSTER_SIZE > numCPUs) {
    console.log(
      `${process.env.CLUSTER_SIZE} is greater than available CPUs ${numCPUs}. Using ${numCPUs} instead`
    );
  }

  for (let i = 0; i < Math.min(process.env.CLUSTER_SIZE, numCPUs); i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(
      `Worker PID ${worker.process.pid} is online, listening on port ${process.env.SERV_PORT}`
    );
    onlineWorkers++;
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker PID ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    onlineWorkers--;
  });

  process.on("SIGINT", gracefulShutdown("SIGINT"));
  process.on("SIGTERM", gracefulShutdown("SIGTERM"));
} else {
  server.listen(process.env.SERV_PORT);
}
