import winston from 'winston';

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
console.log(`Logger initialized with level: ${logLevel}`);

const colorizer = winston.format.colorize();

const consoleFormat = winston.format.printf(
  ({ timestamp, level, message, module, ...meta }) => {
    const actualModule = module || meta.module || 'global';
    const coloredLevel = colorizer.colorize(level, level.toUpperCase());
    return `[${timestamp}]-[${coloredLevel}][${actualModule}]: ${message}`;
  },
);

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.splat(),
    winston.format.simple(),
    consoleFormat,
  ),
  defaultMeta: { module: 'global' },
  transports: [new winston.transports.Console()],
});

export default logger;
