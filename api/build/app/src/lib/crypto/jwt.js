import jwt from 'jsonwebtoken';
const decode = (token) => jwt.decode(token);
const signWithRSA = (data, privateKey, expiresIn) => {
    const token = jwt.sign(data, privateKey, {
        algorithm: 'RS256',
        expiresIn: expiresIn ?? '1h',
    });
    return token;
};
const verifyWithRSA = (token, publicKeys) => {
    for (const publicKey of publicKeys) {
        try {
            return jwt.verify(token, publicKey, {
                algorithms: ['RS256'],
            });
        }
        catch {
        }
    }
    throw new Error('Token verification failed with all provided public keys');
};
const signWithSecret = (data, secret, expiresIn) => {
    const token = jwt.sign(data, secret, {
        algorithm: 'HS256',
        expiresIn: expiresIn ?? '1h',
    });
    return token;
};
const verifyWithSecrets = (token, secrets) => {
    for (const secret of secrets) {
        try {
            return jwt.verify(token, secret, {
                algorithms: ['HS256'],
            });
        }
        catch {
        }
    }
    throw new Error('Token verification failed with all provided secrets');
};
const jsonWebToken = {
    decode,
    signWithRSA,
    verifyWithRSA,
    signWithSecret,
    verifyWithSecrets,
};
export default jsonWebToken;
//# sourceMappingURL=jwt.js.map