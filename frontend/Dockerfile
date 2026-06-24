FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# VITE_API_URL is baked in at build time; /api is stripped by Caddy before proxying to backend
ENV VITE_API_URL=/api
RUN npx vite build

FROM caddy:2-alpine
COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
