const { Worker, isMainThread, parentPort } = require('worker_threads');
const crypto = require('crypto');

// init a bigint array constant
const big64arr = new BigUint64Array(1); // arg is length of the array

const random64 = () => {
  // fill the array with random data
  crypto.randomFillSync(big64arr);
  // return the first (and only) element of the array
  return big64arr[0];
};

const sumDigitsSquared = number => {
  let total = 0n; // the n denotes it as a bigint
  while (number > 0) {
    const numberModuloBase = number % 10n; // lops off the last digit and assigns it
    total += numberModuloBase ** 2n; // adds the square of the lopped off number to total
    number = number / 10n; // divides by 10 to get rid of the last digit
  }
  return total;
};

const isHappy = number => {
  while (number !== 1n && number !== 4n) {
    number = sumDigitsSquared(number);
  }
  return number === 1n;
};

const isHappyCoin = number => isHappy(number) && number % 10000n === 0n;

const THREAD_COUNT = 4;

if (isMainThread) {
  // Main Thread
  let inFlight = THREAD_COUNT; // how does this change?

  let count = 0; // amount of happycoins discovered

  for (let i = 0; i < THREAD_COUNT; i++) {
    // create a new worker
    const worker = new Worker(__filename);
    // set up a listener for passed messages
    worker.on('message', message => {
      // if the message says the worker is done
      if (message === 'done') {
        // decrement inflight, and if its zero
        if (--inFlight === 0) {
          // work is finished, print out how many coins were found
          console.log('\ncount ' + count + '\n');
        }
      } else if (typeof message === 'bigint') {
        // if the type of message is a bigint log it to console and increment count
        console.log(message.toString() + ' ');
        count++;
      }
    });
  }
} else {
  // Worker Thread
  // 10m iterations
  for (let index = 1; index < 10000000 / THREAD_COUNT; index++) {
    // generate a random number
    const randomNum = random64();
    // check if the coin is happy
    if (isHappyCoin(randomNum)) {
      // post a message to the port
      parentPort.postMessage(randomNum);
    }
  }
  // tell the parent the thread is done working
  parentPort.postMessage('done');
}

// 14 seconds!
