# Docker для E2E тестов

Этот проект использует Docker для обеспечения одинакового окружения для E2E тестов как локально, так и в CI.

## Локальный запуск

### Вариант 1: Docker Compose (рекомендуется)

```bash
# Запустить dev server и тесты
docker-compose -f docker-compose.e2e.yml up --build

# Или только тесты (если dev server уже запущен на хосте)
docker-compose -f docker-compose.e2e.yml run --rm e2e-tests
```

### Вариант 2: Docker напрямую

```bash
# Собрать образ
docker build -f Dockerfile.e2e -t cocktails-e2e .

# Запустить тесты (dev server запустится автоматически внутри контейнера)
docker run --rm \
  -e CI=false \
  -e VITE_API_URL=http://localhost:3000/api \
  -v $(pwd)/playwright-report:/app/playwright-report \
  -v $(pwd)/test-results:/app/test-results \
  cocktails-e2e
```

## Преимущества использования Docker

1. **Одинаковое окружение** - тесты работают одинаково локально и в CI
2. **Изоляция** - не влияет на систему разработчика
3. **Воспроизводимость** - всегда используем одинаковые версии браузеров и зависимостей
4. **Простота CI** - GitHub Actions использует тот же Docker контейнер

## Структура файлов

- `Dockerfile.e2e` - Docker образ для E2E тестов на базе официального образа Playwright
- `docker-compose.e2e.yml` - Compose конфигурация для локальной разработки
- `.dockerignore` - файлы, исключаемые из Docker образа

## CI/CD

GitHub Actions автоматически использует Docker контейнер для запуска E2E тестов, что гарантирует одинаковое поведение с локальной средой.

