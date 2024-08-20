# Используем официальный образ Node.js в качестве базового
FROM node:20 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем весь проект
COPY . .

# Устанавливаем pnpm
CMD echo "Устанавливаем pnpm..." && npm install -g pnpm && \
    # Устанавливаем все зависимости
    echo "Устанавливаем все зависимости..." && pnpm install && \
    # Проверяем содержимое директории после установки зависимостей
    echo "Содержимое директории после установки зависимостей:" && ls -la /app && \
    # Собираем все приложения и пакеты
    echo "Собираем все приложения и пакеты..." && pnpm run build && \
    # Проверяем содержимое директории после сборки
    echo "Содержимое директории после сборки:" && ls -la /app/apps/main/dist

# Используем другой базовый образ для минимального размера
FROM nginx:alpine AS runner

# Копируем кастомный конфигурационный файл Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Экспонируем порт 8080
EXPOSE 8080

# Копируем собранные статические файлы и запускаем Nginx
CMD echo "Копируем собранные статические файлы..." && \
    cp -r /app/apps/main/dist /usr/share/nginx/html && \
    echo "Содержимое директории Nginx:" && \
    ls -la /usr/share/nginx/html && \
    echo "Запускаем Nginx..." && \
    nginx -g 'daemon off;'