import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config({ path: `${__dirname}/../.env` });
export const { NODE_ENV, PORT, MONGODB_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = process.env;
