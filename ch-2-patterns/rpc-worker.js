class RpcWorker {
  constructor(path) {
    this.next_command_id = 0;
    this.in_flight_commands = new Map();
    this.worker = new Worker(path);
    this.worker.onmessage = this.onMessageHandler.bind(this);
  }

  /**
   * Handles incoming messages from the worker thread.
   * @param {Object} msg - The message object received from the worker thread.
   */
  onMessageHandler(msg) {
    const { result, error, id } = msg.data;
    const { resolve, reject } = this.in_flight_commands.get(id);
    this.in_flight_commands.delete(id);
    if (error) reject(error);
    resolve(result);
  }

  /**
   * Executes a remote procedure call (RPC) method with the given arguments.
   * @param {string} method - The name of the RPC method to execute.
   * @param {...any} args - The arguments to pass to the RPC method.
   * @returns {Promise<any>} A promise that resolves with the result of the RPC method.
   */
  exec(method, ...args) {
    const id = ++this.next_command_id;
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.in_flight_commands.set(id, { resolve, reject });
    this.worker.postMessage({ method, params: args, id });
    return promise;
  }
}
