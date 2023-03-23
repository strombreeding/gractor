FROM node:18-alpine

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN npm ci
RUN npm build

EXPOSE 3000
ENTRYPOINT ["node","dist/main.js"]




