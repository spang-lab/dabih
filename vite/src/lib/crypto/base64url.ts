/* global BigInt */
const toBase64 = (base64url: string): string =>
  base64url.replace(/-/g, "+").replace(/_/g, "/");

const fromBase64 = (base64: string): string =>
  base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

const fromUint8 = (array: ArrayBuffer | ArrayLike<number>): string => {
  const uintArray = new Uint8Array(array);
  const base64 = btoa(String.fromCharCode(...uintArray));
  return fromBase64(base64);
};

const toUint8 = (base64url: string): Uint8Array => {
  const base64 = toBase64(base64url);
  const mapper = (c: string) => c.charCodeAt(0);
  return Uint8Array.from(atob(base64), mapper);
};

const toBigInt2 = (base64url: string): bigint => {
  const array = toUint8(base64url);
  let result = BigInt(0);
  for (let i = 0; i < array.length; i += 1) {
    // Shift the current byte by 8 * i bits to the left and add it to the result
    result += BigInt(array[i]) << BigInt(8 * i);
  }
  return result;
};

const toBigInt = (base64url: string): bigint => {
  const base64 = toBase64(base64url);
  const bin = atob(base64);
  const hex: string[] = [];

  bin.split("").forEach((ch) => {
    let h = ch.charCodeAt(0).toString(16);
    if (h.length % 2) {
      h = `0${h}`;
    }
    hex.push(h);
  });

  return BigInt(`0x${hex.join("")}`);
};

const fromBigInt = (bigInt: bigint): string => {
  if (bigInt < BigInt(0)) {
    throw new Error("BigInt must be non-negative for Uint8Array conversion.");
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
    uint8Array[i] = Number(tmp & BigInt(0xff));
    tmp >>= BigInt(8);
  }
  uint8Array.reverse();
  return fromUint8(uint8Array);
};

const fromString = (str: string): string => {
  const encoded = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_m, p1) =>
    String.fromCharCode(parseInt(p1, 16)),
  );
  const base64 = btoa(encoded);
  return fromBase64(base64);
};

const toString = (base64url: string): string => {
  const base64 = toBase64(base64url);
  const buffer = Array.prototype.map
    .call(
      atob(base64),
      (c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`,
    )
    .join("");
  return decodeURIComponent(buffer);
};

const base64url = {
  toBase64,
  fromBase64,
  fromUint8,
  toUint8,
  toBigInt,
  toBigInt2,
  fromBigInt,
  fromString,
  toString,
};
export default base64url;
