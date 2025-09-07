import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from '@config/logger';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import http, { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '@scripts/swagger-output.json';

import { initRegistrationRouter } from '@routes/registration.route';
import { initUserRouter } from '@routes/user.route';
import type { RegistrationController } from '@controllers/registration.controller';
import type { UserController } from '@controllers/user.controller';

export class App {
  public app: Application;
  private server: Server | null = null;
  private readonly RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
  private readonly RATE_LIMIT_MAX_REQUESTS = 100;

  constructor() {
    this.app = express();
    this.initialiseMiddlewares();
  }

  private initialiseMiddlewares() {
    this.app.use(
      helmet({
        noSniff: true,
        contentSecurityPolicy: false,
        hsts: false,
        hidePoweredBy: true,
      }),
    );
    this.app.use(
      rateLimit({
        windowMs: this.RATE_LIMIT_WINDOW_MS,
        max: this.RATE_LIMIT_MAX_REQUESTS,
      }),
    );
    const allowedOrigins = process.env.CLIENT_ORIGINS?.split(',') ?? [
      'http://localhost:3000',
    ];
    this.app.use(
      cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      }),
    );
    this.app.use(
      morgan('tiny', { stream: { write: (m) => logger.info(m.trim()) } }),
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  public init(controllers: {
    registration: RegistrationController;
    user: UserController;
  }) {
    this.app.use(
      '/api/v1/register',
      initRegistrationRouter(controllers.registration),
      // #swagger.tags = ['Registration']
    );
    this.app.use(
      '/api/v1/users',
      initUserRouter(controllers.user),
      // #swagger.tags = ['Users']
    );

    if (process.env.NODE_ENV === 'development') {
      this.app.use(
        '/api/v1/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec),
      );
      logger.info('Swagger UI is enabled at /api/v1/docs');
    }
  }

  public listen(port: number, callback?: () => void): void {
    this.server = http.createServer(this.app);
    this.server.listen(port, callback);
    logger.info(`Initialising server on port ${port}`, { module: 'app' });
  }

  public close(callback?: () => void): void {
    if (this.server) {
      this.server.close(callback);
      logger.info('Server closed', { module: 'app' });
    } else {
      logger.warn('No server to close', { module: 'app' });
    }
  }
}
