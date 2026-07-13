# Market

Веб сервис, который ищет товары на маркетплейсах (Kaspi, Wildberries, Ozon, AliExpress, Alibaba) по текстовому запросу или фотографии, оценивает результаты по цене и качеству и возвращает ранжированный топ список.

## Стек

- React + TypeScript + Vite
- Tailwind CSS v4
- Supabase (Postgres, Auth, Edge Functions)
- Деплой на Vercel

## Структура папок

- `src/landing` презентационная часть (лендинг)
- `src/app` основное приложение
- `src/shared` общий код: UI компоненты, клиент Supabase, i18n
- `supabase/functions` Edge Functions (серверный поиск по маркетплейсам)
- `supabase/migrations` SQL миграции

## Языки интерфейса

Русский, английский, казахский. Переключение мгновенное, выбранный язык сохраняется между визитами.

## Как запустить

```bash
npm install
cp .env.example .env
npm run dev
```

Затем откройте адрес, который покажет Vite (обычно http://localhost:5173).
