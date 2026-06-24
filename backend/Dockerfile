FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json nest-cli.json tsconfig*.json ./
RUN npm install
COPY src ./src
RUN npm run build

FROM node:20-alpine
RUN npm install -g pm2
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY ecosystem.config.js ./
EXPOSE 4000
CMD ["pm2-runtime", "ecosystem.config.js"]
