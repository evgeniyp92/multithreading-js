// NB when creating additional worker threads its important to keep in mind what
// the UV_THREADPOOL_SIZE is set to, as trying to generate more than 4 threads
// without changing this will not yield better results -- you'll be stacking
// threads on threads

// // bidirectional comms via default message port
const { Worker, isMainThread, parentPort } = require('worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', msg => {
    worker.postMessage(msg);
  });
} else {
  parentPort.on('message', msg => {
    console.log('received message from parent: ', msg);
  });
  parentPort.postMessage('hello world');
}
