# EM Test Assignment

A simple API service to work with user entities

## Packages

- Built with **Express 5**
- Secure by default: uses **Helmet**, **CORS**, and **rate limiting**
- Schema validation with **Zod**
- Logging via **Winston** and **Morgan**
- Password hashing via **Argon2**
- PostgreSQL via **DrizzleORM**
- Testing setup with **Jest** and **ts-jest**
- Linting and formatting with **ESLint** and **Prettier**
- Git hooks via **Husky**

## Configuration

Create .env file in the root folder of your project.
Configure parameters:

```yaml
# Node.js Environment Variable (production or development)
NODE_ENV=production
PORT=3000
# Swagger UI backend server (works only in development mode)
SWAGGER_BE=http://localhost:3000

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

#App DB connection
DATABASE_URL='postgresql://postgres:password!1@pg:5632/em-test-task?schema=public'

# Database settings
DB_HOST=pg
DB_NAME=em-test-task
DB_USER=postgres
DB_PASS=password!1
DB_PORT=5632
```

## Installation

### Local development:

 - Go to the root folder of the project and run.

 ```shell
 npm install
 ```
 - Start PostgreSQL server in docker

 ```shell
 docker compose -f docker-compose.infra.yml up -d
 ```
 - Run DrizzleORM migration

 ```shell
 npx drizzle-kit migrate
 ```

 - Start Express.js in dev mode

 ```shell
 npm run dev
 ```

## Running the app in docker

 - Go to the root folder of the project and run

 ```shell
 docker compose -f docker-compose.yml
 ```
 To test application endpoints use Swagger-UI. 
 Open your browser and navigate to http://localhost:3000/api/v1/docs
