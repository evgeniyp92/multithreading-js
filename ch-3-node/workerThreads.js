// NB when creating additional worker threads its important to keep in mind what
// the UV_THREADPOOL_SIZE is set to, as trying to generate more than 4 threads
// without changing this will not yield better results -- you'll be stacking
// threads on threads

// // basic worker instantiation
const { Worker } = require('worker_threads');
const worker = new Worker(__filename);
