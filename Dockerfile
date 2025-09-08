FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build


FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src/scripts/swagger-output.json ./dist/src/scripts/swagger-output.json
COPY --from=builder /app/src/scripts/start.sh ./scripts/start.sh

RUN chmod +x ./scripts/start.sh

RUN npm prune --omit=dev

EXPOSE 3000
CMD ["./scripts/start.sh"]
