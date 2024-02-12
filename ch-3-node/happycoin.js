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

let count = 0;
for (let index = 0; index < 10000000; index++) {
  const randomNum = random64();
  if (isHappyCoin(randomNum)) {
    console.log(randomNum.toString() + ' ');
    count++;
  }
}

console.log('\ncount ' + count + '\n');

// about 51 seconds
