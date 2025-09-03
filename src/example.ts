import logger from '@config/logger';

const myTestFunction = (a: string): string => {
  logger.info(`myTestFunction called with argument: ${a}`, {
    module: 'example',
  });
  return a;
};

export default myTestFunction;
