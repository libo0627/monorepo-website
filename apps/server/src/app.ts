import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { API_PREFIX } from '@mono/shared';
import { logger } from './lib/logger';
import { errorHandler, notFound } from './middlewares/error';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.use(API_PREFIX, apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
