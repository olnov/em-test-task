#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
while ! nc -z pg 5632; do
  sleep 1
done

echo "PostgreSQL is ready! Applying migrations..."

npx drizzle-kit migrate

echo "Migrations applied. Starting application..."

node dist/src/main.js