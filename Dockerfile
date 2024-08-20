FROM node:20 as build

WORKDIR /main-app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run build

# Используем другой базовый образ для минимального размера
FROM nginx:alpine AS runner

# Копируем собранные статические файлы из предыдущего этапа
COPY --from=build /app/apps/main/dist /usr/share/nginx/html

# Экспонируем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
