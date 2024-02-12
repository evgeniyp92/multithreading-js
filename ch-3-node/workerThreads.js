// NB when creating additional worker threads its important to keep in mind what
// the UV_THREADPOOL_SIZE is set to, as trying to generate more than 4 threads
// without changing this will not yield better results -- you'll be stacking
// threads on threads

// bidirectional comms via MessagePort created with MessageChannel
// This looks confusing because the messages are being sent in a circular fashion
const {
  Worker,
  isMainThread,
  MessageChannel,
  workerData,
} = require('worker_threads');

if (isMainThread) {
  const { port1, port2 } = new MessageChannel();

  const worker = new Worker(__filename, {
    workerData: { port: port2 }, // sets up port2 to be port in the worker
    transferList: [port2], // gives over ownership of port2 to the worker
    // ports that are transferred over cannot be used on the sending side anymore
  });

  port1.on('message', data => {
    console.log('port 1 got a message: ', data);
    port1.postMessage(data);
  });
} else {
  const { port } = workerData; // receiving the port (which is port2 in the side scope)
  port.on('message', msg => {
    console.log('got a message from main: ', msg);
  });
  port.postMessage('Hello world');
}

// TODO: Look into ReadableStream and WritableStream for communicating across threads
