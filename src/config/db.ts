import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, PoolConfig } from "pg";
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import logger from '@config/logger';
import * as schema from '@db/schema';

export class DB {
  private static instance: DB;
  private pool: Pool | null = null;
  private db: NodePgDatabase<typeof schema> | null = null;
  private readonly config: PoolConfig;

  constructor () {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      logger.error('DATABASE_URL is not set in env variables', { module: 'db' });
      process.exit(1);
    }

    this.config = {
      connectionString: DATABASE_URL,
      max: parseInt(process.env.DB_POOL_MAX || '20'), 
      min: parseInt(process.env.DB_POOL_MIN || '2'), 
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

  }

  public static getInstance():DB {
    if (!DB.instance) {
      DB.instance = new DB;
    }
    return DB.instance;
  }

  public async connect(): Promise<NodePgDatabase<typeof schema>> {
    if (this.db) {
      return this.db;
    }

    try {
      this.pool = new Pool(this.config);

      // Testing connection
      const isHealthy = await this.healthCheck();
      if (!isHealthy) {
        throw new Error('Database connection test failed');
      }

      this.db = drizzle(this.pool, { schema });
      logger.info('Connected to the DB', {module: 'db'});

      // Client error handling
      this.pool.on('error', (error)=> {
        logger.error(`Unexpected error on idle client: ${error.message}`, { module: 'db' })
      });

      this.pool.on('connect', ()=> {
        logger.debug(`New client connected to the DB server`, { module: 'db' })
      });
      
      return this.db;

    }catch(error){
      logger.error(`Error connecting DB: ${error}`, { module: 'db'});
      throw error;
    }
  }

  public getConnection() {
    if(!this.db) {
      logger.error('Database not connected. Call connect() first.');
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.end();
        this.pool = null;
        this.db = null;
        logger.info('Database connection pool closed', { module: 'db' });
      }
    } catch (error) {
      logger.error(`Error closing database connection: ${error}`, { 
        module: 'db', 
      });
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.pool) {
        return false;
      }
      
      const client = await this.pool.connect();
      const result = await client.query('SELECT 1 as health_check');
      client.release();
      
      return result.rows[0]?.health_check === 1;
    } catch (error) {
      logger.error('Database health check failed', { 
        module: 'db', 
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }

  public setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, closing database connections...`, { module: 'db' });
      try {
        await this.disconnect();
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown', { module: 'db', error });
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  }

}

export const createDatabase = async (): Promise<NodePgDatabase<typeof schema>> => {
  const db = DB.getInstance();
  return await db.connect();
};
