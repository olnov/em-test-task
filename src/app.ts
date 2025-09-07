import express, { Application } from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from '@config/logger';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
// import exampleRouter from '@routes/example.route';
import 'dotenv/config';
import http, { Server } from 'http';
import registrationRouter from '@routes/registration.route';

export class App {
  public app: Application;
  private server: Server | null = null;
  private readonly RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes time window
  private readonly RATE_LIMIT_MAX_REQUESTS = 100 // max 100 connection from one IP in time window

  constructor() {
    this.app = express();
    this.initialiseMiddlewares();
    this.initialiseRoutes();
  }

  // Security headers
  private initialiseMiddlewares() {
    this.app.use(
      helmet({
        noSniff: true, // Block MIME type sniffing
        xssFilter: true, // Enable XSS protection
        contentSecurityPolicy: false, // Should be configured at the proxy level
        hsts: false, // Should be configured at the proxy level
        hidePoweredBy: true, // Hide the "X-Powered-By" header
      }),
    );

    // Rate limiting
    this.app.use(
      rateLimit({
        windowMs: this.RATE_LIMIT_WINDOW_MS,
        max: this.RATE_LIMIT_MAX_REQUESTS
      }),
    );

    // CORS configuration
    const allowedOrigins = process.env.CLIENT_ORIGINS
      ? process.env.CLIENT_ORIGINS.split(',')
      : ['http://localhost:3000'];

    this.app.use(
      cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      }),
    );

    // HTTP Logging middleware
    this.app.use(
      morgan('tiny', {
        stream: {
          write: (message) => logger.info(message.trim()),
        },
      }),
    );

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  // API Routes
  private initialiseRoutes() {
    // this.app.use('/api/example', exampleRouter);
    this.app.use('/api/v1/register', registrationRouter);
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
