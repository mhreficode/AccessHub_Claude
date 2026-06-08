import { createApp } from './app';
import { prisma } from './db';

const port = Number(process.env.API_PORT ?? 4000);
const app = createApp();

const server = app.listen(port, () => {
  console.log(`AccessHub API listening on http://localhost:${port}`);
});

async function shutdown(): Promise<void> {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
