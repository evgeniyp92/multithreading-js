console.log("hello from main.js");

// make an instance of a new worker
const worker = new Worker("worker.js");

// attach a handler to the onmessage prop
worker.onmessage = msg => {
  // msg is an instance of MessageEvent
  console.log("message received from worker", msg.data);
};

// send a message to the worker -- note there are restrictions on the kind of data that can be passed as an arg here
worker.postMessage("message sent to worker");

console.log("hello from end of main.js");

// Worker methods
// worker.postMessage;
// worker.onmessage;
// worker.onerror;
// worker.onmessageerror;
// worker.terminate();

const worker2 = new Worker("filename.txt", {
  credentials, // whether or not to send credentials. omit/include/same-origin
  name, // name the dedicated worker for debugging
  type, // classic (CommonJS) or module (ESM)
});
