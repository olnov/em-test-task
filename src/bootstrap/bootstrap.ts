import { App } from '@/app';
import { DB } from '@/config/db';
import logger from '@/config/logger';

export class Bootstrap {
  private readonly app: App;
  private readonly db: DB;

  constructor(app: App, db: DB) {
    this.app = app;
    this.db = db;
  }

  public async start(port: number, mode: string): Promise<void> {
    await this.db.connect();

    this.app.listen(port, () => {
      logger.info(
        `Server running at http://localhost:${port} in ${mode} mode`,
        { module: 'bootstrap' },
      );
    });
  }

  public shutdown(): void {
    this.app.close(() => {
      logger.info('App shut down gracefully', { module: 'bootstrap' });
      process.exit(0);
    });
  }
}
