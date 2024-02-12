// basic http server with clustering

// main thread acts as a load balancer and dispatches work on a round-robin
// basis. main thread is the one listening on port 3000, not the 4 workers

const http = require('http');
const cluster = require('cluster');

if (cluster.isPrimary) {
  // if in primary process, create workers
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  // in a worker process, make an http server
  const server = http.createServer();
  server.listen(3000);
}

// issue with this implementation is that spawning processes incurs extra
// overhead and there is no shared memory
