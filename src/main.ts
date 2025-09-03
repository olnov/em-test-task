import { App } from './app';
import { DB } from '@config/db';
import { GlobalHandlers } from '@core/global-handlers';
import { Bootstrap } from '@bootstrap/bootstrap';
import logger from '@config/logger';

const PORT: number = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV: string = process.env.NODE_ENV || 'development';

const server = new App();
const db = new DB();
const bootstrap = new Bootstrap(server, db);
const globalHandlers = new GlobalHandlers();

// Setting up global handlers
globalHandlers.setup();

// Graceful shutdown handler
const shutdown = () => {
  logger.info('Received shutdown signal, shutting down gracefully...', {
    module: 'main',
  });
  bootstrap.shutdown();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGQUIT', shutdown);

// Start the application
bootstrap.start(PORT, NODE_ENV);
