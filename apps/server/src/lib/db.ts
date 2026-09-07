import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './logger';

let connected = false;

export async function connectDB() {
  if (connected) return;
  await mongoose.connect(config.mongodbUri);
  connected = true;
  logger.info({ uri: config.mongodbUri }, 'mongodb connected');
}

export async function disconnectDB() {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
  logger.info('mongodb disconnected');
}
