/* eslint-disable no-bitwise */
/* global BigInt */
const toBase64 = (base64url: string): string => base64url.replace(/-/g, '+').replace(/_/g, '/');
const fromBase64 = (base64: string): string => base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

const fromUint8 = (array: ArrayBuffer): string => {
  const uintArray = new Uint8Array(array);
  const base64 = window.btoa(String.fromCharCode(...uintArray));
  return fromBase64(base64);
};

const toUint8 = (base64url: string): Uint8Array => {
  const base64 = toBase64(base64url);
  const mapper = (c: string) => c.charCodeAt(0);
  return Uint8Array.from(window.atob(base64), mapper);
};

const toBigInt = (base64url: string): bigint => {
  const array = toUint8(base64url);
  let result = BigInt(0);
  for (let i = 0; i < array.length; i += 1) {
    // Shift the current byte by 8 * i bits to the left and add it to the result
    result += BigInt(array[i]) << BigInt(8 * i);
  }
  return result;
};

const fromBigInt = (bigInt: bigint): string => {
  if (bigInt < BigInt(0)) {
    throw new Error('BigInt must be non-negative for Uint8Array conversion.');
  }
  let byteCount = 0;
  let tmp = bigInt;

  while (tmp > BigInt(0)) {
    tmp >>= BigInt(8);
    byteCount += 1;
  }
  tmp = bigInt;

  const uint8Array = new Uint8Array(byteCount);

  for (let i = 0; i < byteCount; i += 1) {
    uint8Array[i] = Number(tmp & BigInt(0xFF));
    tmp >>= BigInt(8);
  }

  // Reverse the Uint8Array because bytes were extracted in little-endian order
  uint8Array.reverse();
  return fromUint8(uint8Array);
};

export default {
  toBase64,
  fromBase64,
  fromUint8,
  toUint8,
  toBigInt,
  fromBigInt,
};
