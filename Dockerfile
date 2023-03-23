FROM node:18-alpine

RUN mkdir -p /app

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

ENTRYPOINT ["node","dist/main.js"]




