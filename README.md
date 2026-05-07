# TodoList — Full-stack приложение

Клиент-серверное приложение для управления списком задач (TodoList) с полной реализацией CRUD-операций и защитой API-маршрутов с помощью API-ключа.

## Демо

Фронтенд развёрнут на Vercel: https://todo-app-eight-nu-23.vercel.app

> На прод-версии бэкенд недоступен (он работает только локально), поэтому в браузере отображается информационный баннер о демо-режиме. Для полноценной работы CRUD-операций запустите проект локально по инструкции ниже.

## Структура проекта

Монорепо с двумя приложениями:

- **`todo-frontend/`** — клиент на React + Vite.
- **`todo-backend/`** — сервер на Node.js + Express.

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | React 18, Vite |
| Backend | Node.js, Express, dotenv, cors |
| Хранилище | in-memory массив (учебный проект, БД не используется) |

## Требования

- Node.js ≥ 18
- npm ≥ 10

## Установка и запуск (локально)

### 1. Клонирование репозитория

```bash
git clone https://github.com/Alina32846/todo-app.git
cd todo-app
```

### 2. Настройка переменных окружения

**Backend** — создайте `todo-backend/.env` на основе `todo-backend/.env.example`:

```
PORT=3000
API_KEY=dev-secret-key-12345
```

**Frontend** — создайте `todo-frontend/.env` на основе `todo-frontend/.env.example`:

```
VITE_API_BASE=http://localhost:3000
VITE_API_KEY=dev-secret-key-12345
```

> **Важно:** значение `VITE_API_KEY` во фронте должно совпадать с `API_KEY` в бэке.

### 3. Запуск бэкенда

В первом терминале:

```bash
cd todo-backend
npm install
npm start
```

Сервер поднимется на `http://localhost:3000` и выведет `Server listening on port 3000`.

### 4. Запуск фронтенда

Во втором терминале:

```bash
cd todo-frontend
npm install
npm run dev
```

Откройте `http://localhost:5173` в браузере.

## API

Все маршруты `/api/*` защищены middleware `checkApiKey`. Запросы должны содержать заголовок `x-api-key: <ключ>`. Без него или с неверным значением сервер вернёт `401 Unauthorized`.

| Метод | Путь | Описание | Тело запроса | Ответ |
|-------|------|----------|--------------|-------|
| GET | `/api/tasks` | Список всех задач | — | `200` + массив |
| POST | `/api/tasks` | Создать задачу | `{ "title": "..." }` | `201` + созданный объект |
| PUT | `/api/tasks/:id` | Обновить задачу | `{ "title"?, "done"? }` | `200` + обновлённый объект |
| DELETE | `/api/tasks/:id` | Удалить задачу | — | `204` |

### Пример

```bash
curl -H "x-api-key: dev-secret-key-12345" http://localhost:3000/api/tasks
```

## Сборка фронтенда

```bash
cd todo-frontend
npm run build
```

Соберёт оптимизированную статику в `todo-frontend/dist/` — этот каталог используется для деплоя.

## Деплой

Фронтенд развёрнут на Vercel с автоматическим деплоем из ветки `main`. Подробнее — в материалах ПЗ №11.

## Автор

Шувалова Алина Андреевна, направление 09.03.03 «Прикладная информатика».
