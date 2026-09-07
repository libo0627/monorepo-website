import './lib/config';
import { config } from './lib/config';
import { connectDB } from './lib/db';
import { createApp } from './app';
import { logger } from './lib/logger';
import { seedTurkishWheel } from './activities/turkish-wheel/seed';
import { seedGaneshChaturthi } from './activities/ganesh-chaturthi/seed';

const port = config.port;

async function main() {
  await connectDB();
  await seedTurkishWheel();
  await seedGaneshChaturthi();

  createApp().listen(port, () => {
    logger.info(`server listening on http://localhost:${port} [${config.env}]`);
  });
}

main().catch((err) => {
  logger.error({ err }, 'failed to start server');
  process.exit(1);
});
