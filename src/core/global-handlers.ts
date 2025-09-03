import logger from '@config/logger';

export class GlobalHandlers {
  /**
   * Setting up global handlers for uncaught exceptions and unhandled promise rejections.
   * Helps to prevent the application from crahing silently.
   */

  public setup(): void {
    process.on('uncaughtException', (error) => {
      logger.error(`Uncaught Exception: ${error}`, {
        module: 'globalHandlers',
      });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`, {
        module: 'globalHandlers',
      });
      process.exit(1);
    });
  }
}
