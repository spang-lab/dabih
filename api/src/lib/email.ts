import { Resend } from 'resend';
import { getEnv } from './env';
import logger from './logger';

let resend: Resend | null = null;
let fromEmail: string | null = null;

export function initEmail() {
  const token = getEnv('RESEND_TOKEN');
  fromEmail = getEnv('RESEND_EMAIL');
  if (!token) {
    logger.warn('RESEND_TOKEN is not set, email functionality will not work');
    return;
  }
  if (!fromEmail) {
    logger.warn('RESEND_EMAIL is not set, email functionality will not work');
    return;
  }
  resend = new Resend(token);
}

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
) {
  if (!resend || !fromEmail) {
    throw new Error('Email service is not initialized');
  }
  const email = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });
  return email;
}

export function hasEmail() {
  return !!resend && !!fromEmail;
}
