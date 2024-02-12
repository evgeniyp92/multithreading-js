// NB when creating additional worker threads its important to keep in mind what
// the UV_THREADPOOL_SIZE is set to, as trying to generate more than 4 threads
// without changing this will not yield better results -- you'll be stacking
// threads on threads

// // basic worker instantiation
const { Worker, isMainThread, workerData } = require('worker_threads');
if (isMainThread) {
  // literals such as the one passed below are cloned (what about references to objects/arrays?)
  const worker = new Worker(__filename, { workerData: { num: 42 } });
} else {
  console.log(workerData.num === 42); // returns true
}
