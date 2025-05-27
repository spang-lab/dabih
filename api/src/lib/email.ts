import { Resend } from 'resend';
import { getEnv } from './env';

let resend: Resend | null = null;
let fromEmail: string | null = null;

export function initEmail() {
  const token = getEnv('RESEND_TOKEN');
  if (!token) {
    throw new Error(
      'RESEND_TOKEN is not set, email functionality will not work',
    );
  }
  resend = new Resend(token);
  fromEmail = getEnv('RESEND_EMAIL', 'dabih@resend.dev');
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
