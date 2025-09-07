import { App } from '@/app';
import { DB } from '@config/db';
import logger from '@config/logger';

import { RegistrationController } from '@controllers/registration.controller';
import { UserController } from '@controllers/user.controller';

export class Bootstrap {
  private readonly app: App;
  private readonly db: DB;

  constructor(app: App, db: DB) {
    this.app = app;
    this.db = db;
  }

  public async start(port: number, mode: string): Promise<void> {
    await this.db.connect();

    const registrationController = new RegistrationController();
    const userController = new UserController();

    this.app.init({
      registration: registrationController,
      user: userController,
    });

    this.app.listen(port, () => {
      logger.info(
        `Server running at http://localhost:${port} in ${mode} mode`,
        { module: 'bootstrap' },
      );
    });
  }

  public shutdown(): void {
    this.app.close(() => {
      logger.info('App shutdown gracefully', { module: 'bootstrap' });
      process.exit(0);
    });
  }
}
