const ID = Math.floor(Math.random() * 999999); // random debug ID
console.log("shared-worker.js", ID);

const ports = new Set(); // singleton list of ports

// connection event handler
self.onconnect = event => {
  // get the port the event came in on and add it to ports
  const port = event.ports[0];
  ports.add(port);
  console.log("CONN", ID, ports.size);

  // callback for new messages
  port.onmessage = event => {
    console.log("MESSAGE", ID, event.data);

    // messages are dispatched to every window previously recorded in ports
    for (let p of ports) {
      p.postMessage([ID, event.data]);
    }
  };
};

// kinda works like websockets

// shared workers must be inspected in chrome via chrome://inspect#workers
// in firefox about:debugging

// The shared worker instances do have access to a connect event, which can be
// handled with the self.onconnect() method. Notably missing, especially if
// you’re familiar with WebSockets, is a disconnect or close event. When it
// comes to creating a singleton collection of port instances, like in the
// sample code in this section, it’s very easy to create a memory leak. In this
// case, just keep refreshing one of the windows, and each refresh adds a new
// entry to the set. This is far from ideal. One thing you can do to address
// this is to add an event listener in your main JavaScript environments (i.e.,
// red.js and blue.js) that fires when the page is being torn down. Have this
// event listener pass a special message to the shared worker. Within the shared
// worker, when the message is received, remove the port from the list of ports.

// // main.js
// window.addEventListener("beforeunload", () => {
//   worker.port.postMessage("close");
// });

// // shared worker
// port.onmessage = event => {
//   if (event.data === "close") {
//     ports.delete(port);
//     return;
//   }
// };

// Unfortunately, there are still situations where a port can stick around. If
// the beforeunload event doesn’t fire, or if an error happens when it’s fired,
// or if the page crashes in an unanticipated way, this can lead to expired port
// references sticking around in the shared worker. A more robust system would
// also need a way for the shared worker to occasionally “ping” the calling
// environments, sending a special message via port.postMessage(), and have the
// calling environments reply. With such an approach the shared worker can
// delete port instances if it doesn’t receive a reply within a certain amount
// of time. But even this approach isn’t perfect, as a slow JavaScript
// environment can lead to long response times. Luckily, interacting with ports
// that no longer have a valid JavaScript associated with them doesn’t have much
// of a side effect.
