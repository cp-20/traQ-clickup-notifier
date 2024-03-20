import crypto from 'crypto';

const calcHMACSHA1 = (message: string, secret: string) => {
  return crypto.createHmac('sha1', secret).update(message).digest('hex');
};

import { WEBHOOK_ID, WEBHOOK_SECRET } from './env';

export const postTraqMessage = async (message: string) => {
  const url = `https://q.trap.jp/api/v3/webhooks/${WEBHOOK_ID}?embed=true`;
  const headers = {
    'Content-Type': 'text/plain',
    'X-TRAQ-Signature': calcHMACSHA1(message, WEBHOOK_SECRET),
  };
  const res = await fetch(url, { method: 'POST', headers, body: message });

  if (!res.ok) {
    throw new Error(
      `Failed to post message to traQ: ${res.statusText}\n${await res.text()}`
    );
  }

  return res;
};
