/* global BigInt */

function GCD(a: bigint, b: bigint) {
  if (b === BigInt(0)) {
    return [BigInt(1), BigInt(0), a];
  }
  const [x1, y1, gcd] = GCD(b, a % b);
  const x = y1;
  const y = x1 - (a / b) * y1;
  return [x, y, gcd];
}

const invert = (a: bigint, m: bigint) => {
  const [x, , gcd] = GCD(a, m);
  if (gcd !== BigInt(1)) {
    throw new Error('Inverse does not exist');
  }
  if (x < 0) {
    return x + m;
  }
  return x;
};

const bigInt = {
  invert,
};
export default bigInt;
