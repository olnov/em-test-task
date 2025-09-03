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
COPY --from=builder /app/src/common/email/templates ./dist/src/common/email/templates
COPY --from=builder /app/src/static/fonts ./dist/src/static/fonts
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev

EXPOSE 3000
CMD ["node", "dist/main.js"]
