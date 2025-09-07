import 'dotenv/config';
import swaggerAutogenFactory from 'swagger-autogen';

const swaggerAutogen = swaggerAutogenFactory({
  openapi: '3.0.0',
  debug: true,
  language: 'ts',
  autoHeader: true,
  autoQuery: true,
  autoResponse: true,
  autoPath: true,
  autoBody: true,
});

const doc = {
  info: {
    title: 'EM User Service API',
    description: 'EM User Service API Documentation',
  },
  // eslint-disable-next-line no-undef
  servers: [{ url: process.env.SWAGGER_BE }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const outputFile = './swagger-output.json';
const routes = [
  '../swagger-setup.ts',
];

swaggerAutogen(outputFile, routes, doc);

