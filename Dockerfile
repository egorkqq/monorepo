# Используем официальный образ Node.js в качестве базового
FROM node:20 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем весь проект
COPY . .

# Устанавливаем pnpm
RUN echo "Устанавливаем pnpm..." && npm install -g pnpm

# Устанавливаем все зависимости
RUN echo "Устанавливаем все зависимости..." && pnpm install

# Проверяем содержимое директории после установки зависимостей
RUN echo "Содержимое директории после установки зависимостей:" && ls -la /app

# Собираем все приложения и пакеты
RUN echo "Собираем все приложения и пакеты..." && pnpm run build

# Проверяем содержимое директории после сборки
RUN echo "Содержимое директории после сборки:" && ls -la /app/apps/main/dist

# Используем другой базовый образ для минимального размера
FROM nginx:alpine AS runner

# Копируем собранные статические файлы из предыдущего этапа
RUN echo "Копируем собранные статические файлы..." && \
    cp -r /app/apps/main/dist /usr/share/nginx/html

# Проверяем содержимое директории Nginx
RUN echo "Содержимое директории Nginx:" && ls -la /usr/share/nginx/html

# Копируем кастомный конфигурационный файл Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Экспонируем порт 8080
EXPOSE 8080

# Запускаем Nginx
CMD echo "Запускаем Nginx..." && nginx -g 'daemon off;'