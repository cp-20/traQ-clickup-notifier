export const API_KEY = process.env.API_KEY as string;
if (!API_KEY) {
  throw new Error('API_KEY is required');
}

export const SPACE_ID = process.env.SPACE_ID as string;
if (!SPACE_ID) {
  throw new Error('SPACE_ID is required');
}

export const WEBHOOK_ID = process.env.WEBHOOK_ID as string;
if (!WEBHOOK_ID) {
  throw new Error('WEBHOOK_ID is required');
}

export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string;
if (!WEBHOOK_SECRET) {
  throw new Error('WEBHOOK_SECRET is required');
}
