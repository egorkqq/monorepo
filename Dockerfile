FROM node:20 as build

WORKDIR /main-app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run build