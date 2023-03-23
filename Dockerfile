FROM node:18-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci
RUN npm run build

COPY . .
ENTRYPOINT ["node","dist/main.js"]




