FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3001 PAW_DATABASE_PATH=/app/data/paw.sqlite
COPY --from=builder /app/dist ./dist
COPY server ./server
COPY shared ./shared
COPY scripts/start.mjs ./scripts/start.mjs
COPY package.json ./package.json
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node
VOLUME ["/app/data"]
EXPOSE 3001
CMD ["node", "scripts/start.mjs"]
