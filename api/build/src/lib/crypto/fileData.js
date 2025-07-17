import privateKey from './privateKey';
import publicKey from './publicKey';
import aesKey from './aesKey';
const decryptKey = (privKey, file) => {
    const { keys, data } = file;
    const pubKey = privateKey.toPublicKey(privKey);
    const hash = publicKey.toHash(pubKey);
    const encryptedKey = keys.find((k) => k.hash === hash);
    if (!encryptedKey) {
        throw new Error(`Failed to decrypt: Key with hash ${hash} not found in keys`);
    }
    const key = privateKey.decrypt(privKey, encryptedKey.key);
    const keyHash = aesKey.toHash(key);
    if (keyHash !== data.keyHash) {
        throw new Error(`Failed to decrypt: Hash mismatch: ${keyHash} !== ${encryptedKey.hash}`);
    }
    return key;
};
const fileData = {
    decryptKey,
};
export default fileData;
//# sourceMappingURL=fileData.js.map