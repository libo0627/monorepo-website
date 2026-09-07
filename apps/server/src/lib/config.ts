import dotenv from 'dotenv';
import { resolve } from 'node:path';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: resolve(process.cwd(), `.env.${env}`) });

export const config = {
  env,
  isDev: env === 'development',
  isProd: env === 'production',
  port: Number(process.env.PORT) || 3001,
  logLevel: process.env.LOG_LEVEL || 'info',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/monorepo_dev',
};
