import crypto from '#crypto';
export function convertKey(user, key, isRootKey) {
    const { sub, isAdmin } = user;
    const publicKey = crypto.publicKey.fromJwk(key);
    const test_data = crypto.base64url.fromUtf8('Hello World!');
    try {
        crypto.publicKey.encrypt(publicKey, test_data);
    }
    catch {
        throw new Error('Invalid public key');
    }
    const hash = crypto.publicKey.toHash(publicKey);
    const data = crypto.publicKey.toString(publicKey);
    return {
        hash,
        data,
        isRootKey: isRootKey ?? false,
        enabled: isAdmin ? new Date() : null,
        enabledBy: isAdmin ? sub : null,
    };
}
//# sourceMappingURL=util.js.map