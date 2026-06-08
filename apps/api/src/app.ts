import express, { type Express } from 'express';
import cors from 'cors';
import { currentUser } from './middleware/currentUser';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { usersRouter, meRouter } from './routes/meta.routes';
import { servicesRouter } from './routes/services.routes';
import { accessRequestsRouter } from './routes/accessRequests.routes';
import { apiKeysRouter } from './routes/apiKeys.routes';
import { usageRouter } from './routes/usage.routes';
import { auditRouter } from './routes/audit.routes';

export function createApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Public: user list for the switcher (no x-user-id required).
  app.use('/api/users', usersRouter);

  // Everything below requires an identified user.
  app.use('/api', currentUser);
  app.use('/api/me', meRouter);
  app.use('/api/services', servicesRouter);
  app.use('/api/access-requests', accessRequestsRouter);
  app.use('/api/api-keys', apiKeysRouter);
  app.use('/api/usage', usageRouter);
  app.use('/api/audit-log', auditRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
