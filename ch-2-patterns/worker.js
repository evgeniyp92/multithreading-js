// Function to simulate sleep using a promise and setTimeout
const sleep = () => new Promise(res => setTimeout(res, ms));

// Wrapper function to make an async function compatible with onmessage event handler
function asyncOnMessageWrap(fn) {
  return async function (msg) {
    postMessage(await fn(msg, data));
  };
}

// Object containing various commands that can be executed by the worker
const commands = {
  // Command to calculate the sum of square roots up to a given maximum number
  async square_sum(max) {
    await sleep(Math.random() * 100);
    let sum = 0;
    for (let index = 0; index < max; index++) {
      sum += Math.sqrt(index);
    }
    return sum;
  },

  // Command to calculate the Fibonacci number at a given position
  async fibonacci(limit) {
    await sleep(Math.random() * 100);
    let prev = 1n,
      next = 0n,
      swap;
    while (limit) {
      swap = prev;
      prev = prev + next;
      next = swap;
      limit--;
    }
    return String(next);
  },

  // Command that intentionally throws an error
  async bad() {
    await sleep(Math.random * 100);
    throw new Error("Oh no");
  },
};

// Event handler for incoming messages
self.onmessage = asyncOnMessageWrap(async rpc => {
  const { method, params, id } = rpc;

  if (commands.hasOwnProperty(method)) {
    try {
      /**
       * Executes the specified method with the given parameters and returns the result.
       *
       * @param {string} method - The name of the method to execute.
       * @param {...any} params - The parameters to pass to the method.
       * @returns {Promise<any>} - A promise that resolves to the result of the method execution.
       */
      const result = await commands[method](...params);
      return { id, result };
    } catch (error) {
      return { id, error: { code: -32000, message: error.message } };
    }
  } else {
    return { id, error: { code: -32601, message: `method ${method} not found` } };
  }
});
