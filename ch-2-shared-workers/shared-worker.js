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
