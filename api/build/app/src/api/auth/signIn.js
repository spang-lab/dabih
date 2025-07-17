import crypto from '#lib/crypto/index';
import logger from '#lib/logger';
import db from '#lib/db';
import { hasEmail, sendEmail } from '#lib/email';
import { getSecret, SECRET } from '#lib/redis/secrets';
import { requireEnv } from '#lib/env';
export default async function signIn(email) {
    const existingUser = await db.user.findUnique({
        where: { email },
    });
    const sub = existingUser?.sub ?? (await crypto.random.getToken(10));
    const secret = await getSecret(SECRET.EMAIL);
    const token = crypto.jwt.signWithSecret({
        sub,
        email,
    }, secret);
    if (existingUser) {
        const { lastAuthAt } = existingUser;
        const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000;
        const twoWeeksAgo = new Date(Date.now() - twoWeeks);
        if (lastAuthAt > twoWeeksAgo) {
            return {
                status: 'success',
                token,
            };
        }
    }
    if (!hasEmail()) {
        logger.warn('Email service is not available. Returning token directly');
        return {
            status: 'success',
            token,
        };
    }
    if (!existingUser) {
        logger.info(`New user registration attempt for email: ${email}`);
    }
    const host = requireEnv('HOST');
    const content = {
        to: email,
        subject: `Sign in to Dabih`,
        html: `<p>Click the link below to sign in to Dabih:</p>
       <p><a href="${host}/verify/${token}">Sign in</a></p>
       <p>If you did not request this, please ignore this email.</p>`,
    };
    await sendEmail(content);
    return {
        status: 'email_sent',
    };
}
//# sourceMappingURL=signIn.js.map