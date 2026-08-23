# Stage 1: Build the React client
FROM node:20-alpine AS client-builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Build the Express server
FROM node:20-alpine AS server-builder

WORKDIR /app/server

COPY server/package.json server/package-lock.json* ./
RUN npm ci

COPY server/ .
RUN npm run build

# Stage 3: Run the production server
FROM node:20-alpine

WORKDIR /app

COPY --from=client-builder /app/dist ./dist
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/package.json ./server/package.json

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/dist/index.js"]
