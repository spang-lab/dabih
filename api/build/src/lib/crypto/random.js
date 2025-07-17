import { promisify } from 'node:util';
import { randomFill } from 'node:crypto';
import base64url from './base64url.js';
import adjectives from "./data/adjectives";
import firstNames from "./data/firstNames";
const getBytes = async (n) => {
    const rFill = promisify(randomFill);
    const data = new Uint8Array(n);
    const buffer = await rFill(data);
    return buffer;
};
const getToken = async (len = 8) => {
    const bitsPerChar = 6;
    const bitsPerByte = 8;
    const requiredBits = len * bitsPerChar;
    const requiredBytes = Math.ceil(requiredBits / bitsPerByte);
    const bytes = await getBytes(requiredBytes);
    return base64url.fromUint8(bytes);
};
const sample = (list) => list[Math.floor(Math.random() * list.length)];
const getMnemonic = () => `${sample(adjectives)}_${sample(firstNames)}`;
export default {
    getToken,
    getBytes,
    getMnemonic,
};
//# sourceMappingURL=random.js.map