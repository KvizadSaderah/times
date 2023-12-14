# Базовый образ Python 3
FROM python:3.9-slim

# Установка рабочей директории в контейнере
WORKDIR /app

# Копирование всех файлов в контейнер
COPY . /app/

# Установка зависимостей Python
RUN pip install --no-cache-dir -r requirements.txt

# Объявление порта, который будет слушать контейнер
EXPOSE 5000

# Команда для запуска приложения
CMD ["python", "app.py"]
