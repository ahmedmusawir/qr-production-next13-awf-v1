FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 4004

ENV NODE_OPTIONS="--max-old-space-size=4096"

CMD ["node", "server.js"]
