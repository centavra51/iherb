# iherbs.com.md Programmatic SEO + Next.js

Этот проект подготовлен для массовой генерации SEO-страниц под узкие ключевые запросы в нише wellness, витаминов, БАДов и смежных категорий и уже переведен на `Next.js App Router`.

## Что уже готово

- Статический storefront-лендинг в корне проекта.
- Генератор programmatic SEO-страниц из `CSV`.
- Автогенерация `sitemap.xml`, `robots.txt`, hub-страницы и внутренней перелинковки.
- Поддержка `JSON-LD` schema для `WebPage`, `BreadcrumbList` и `FAQPage`.
- Генератор идей long-tail ключей из seed-наборов.

## Структура проекта

```text
iherbs/
  index.html
  styles.css
  script.js
  README.md
  data/
    keywords.csv
    seed_terms.json
  templates/
    page.template.html
    programmatic.css
  scripts/
    generate_pages.py
    expand_keywords.py
  dist/
    index.html
    sitemap.xml
    robots.txt
    assets/
      programmatic.css
    <slug>/
      index.html
```

## Какая структура страницы лучше для SEO

Для поисковиков и нейросетей лучше всего работает:

1. Чистый `HTML`, который рендерится без обязательного JavaScript.
2. Один главный `H1`.
3. Понятные `H2/H3` блоки с ответом на конкретный интент.
4. Уникальные `title`, `meta description`, `canonical`, `breadcrumbs`.
5. Блок FAQ и `JSON-LD schema`.
6. Внутренняя перелинковка на похожие страницы того же кластера.
7. Человеческий URL вида `/magniy-dlya-sna/`.

Лучший формат для массового SEO в твоем кейсе:

- `static html pages`
- `csv/json` как источник данных
- `json-ld` внутри HTML для schema

## Нужен ли JSON

Да, но не как основной формат страницы.

Важно различать:

- `HTML` нужен для самой страницы и индексации.
- `JSON-LD` нужен для структурированных данных.
- `JSON/CSV` нужен как источник данных для генератора.

То есть поисковику ты отдаешь `HTML`, а не "голый JSON".

## Что важно для ранжирования в 2026

Само по себе создание `1000` страниц не дает рост. Рост дают:

- уникальный интент на каждом URL
- реальная польза, а не подстановка одного ключа в один шаблон
- тематические кластеры
- сильная внутренняя перелинковка
- entity-rich контент: формы, показания, аудитории, сценарии выбора
- частичное покрытие topic graph, а не только exact-match keyphrase
- авторитетные источники и аккуратные health-формулировки

Для нейросетей и answer engines помогает:

- четкая структура страницы
- прямые ответы на вопрос в первых абзацах
- списки "кому подходит", "как выбрать", "частые ошибки"
- FAQ с короткими, ясными ответами
- разметка и семантическая чистота

## Как собирать узкие ключи

Лучший стек:

1. `Google Search Console`
   Берешь реальные показы и запросы, по которым сайт уже близок к росту.

2. `Google Ads Keyword Planner`
   Для группировки и первичной оценки интента.

3. `Ahrefs` или `Semrush`
   Для long-tail, вопросов, matching terms и SERP overlap.

4. `KeywordTool.io`, `AlsoAsked`, `AnswerThePublic`
   Для узких вопросных запросов и autosuggest-вариантов.

5. `SerpApi`, `DataForSEO`, `Keyword Everywhere`
   Если хочешь автоматизировать сбор подсказок из поиска через API.

6. Локальный генератор seed-комбинаций из этого проекта
   Чтобы быстро получить тысячи кандидатных long-tail фраз из базовых сущностей.

## Как работать с этим проектом

## Google Sheets Workflow

Рекомендуемый поток именно под твой сценарий:

1. Веди контент в Google Sheets.
2. Экспортируй лист как `CSV`.
3. Сохраняй экспорт в `data/google_sheets_export.csv`.
4. Запускай импорт:

```bash
python scripts/import_google_sheets_csv.py
```

5. Затем собирай страницы:

```bash
python scripts/generate_pages.py
```

Для `Next.js` генератор HTML уже не обязателен: приложение читает `data/keywords.csv` напрямую на сервере.
Но Python-скрипты остаются полезны как preprocessing pipeline.

## Запуск Next.js

1. Установи зависимости:

```bash
npm install
```

2. Запусти локально:

```bash
npm run dev
```

3. Production build:

```bash
npm run build
npm run start
```

## Как это работает в Next.js

- `app/page.tsx` — главная storefront-страница
- `app/[slug]/page.tsx` — динамические SEO-страницы
- `app/sitemap.ts` — sitemap на основе `data/keywords.csv`
- `app/robots.ts` — robots
- `lib/seo-data.ts` — чтение и парсинг CSV без внешних библиотек
- `data/keywords.csv` — единый источник опубликованных URL

### Шаблон Google Sheets

Готовый шаблон колонок лежит в:

```text
data/google_sheets_template.csv
```

Ты можешь:

- импортировать этот файл в Google Sheets
- вести контент прямо в таблице
- потом скачивать лист обратно как `CSV`

### Какие строки публикуются

Генератор берет только строки со статусом:

- `ready`
- `published`
- `publish`
- пустой `status`

Строки со статусом `draft` автоматически пропускаются. Это удобно, чтобы держать в таблице и черновики, и готовые страницы одновременно.

### 1. Сгенерировать идеи ключей

```bash
python scripts/expand_keywords.py
```

Скрипт прочитает `data/seed_terms.json` и создаст:

```text
data/generated_keyword_ideas.csv
```

### 2. Отобрать лучшие ключи

Оставляй только запросы:

- с понятным коммерческим или mixed intent
- без явного дублирования
- без каннибализации
- с достаточным смысловым отличием между URL

### 3. Заполнить `data/keywords.csv`

В этом файле одна строка = одна страница.

Основные колонки:

- `slug` — URL страницы без домена
- `keyword` — основной long-tail запрос
- `category` — тематический кластер
- `intent` — тип интента: `commercial`, `mixed`, `informational`
- `title` — тег `<title>`
- `meta_description` — meta description
- `h1` — основной заголовок страницы
- `intro` — первый абзац, который быстро отвечает на вопрос
- `benefits` — короткие тезисы через `|`
- `how_to_choose` — основной блок с критериями выбора
- `faq_q1/faq_a1` ... `faq_q3/faq_a3` — FAQ для schema и контента
- `cta_primary`, `cta_secondary` — главные кнопки
- `image_url` — ссылка на главное изображение страницы
- `body_md` — дополнительный markdown-подобный контент для секций страницы
- `status` — статус строки: `draft`, `ready`, `published`

Если `slug` пустой, он будет сгенерирован автоматически из `keyword`.
Если `title` пустой, он будет собран автоматически как `keyword | iherbs.com.md`.
Если `meta_description` пустой, генератор подставит базовое SEO-описание.

### 4. Сгенерировать страницы

```bash
python scripts/generate_pages.py
```

На выходе будет:

- `dist/index.html`
- `dist/sitemap.xml`
- `dist/robots.txt`
- `dist/<slug>/index.html`

## Что публиковать на сервер

Если у тебя уже есть главная страница сайта в корне проекта, то обычно публикуются:

- корневой `index.html`, `styles.css`, `script.js`
- все папки из `dist/<slug>/`
- `dist/sitemap.xml` как `/sitemap.xml`
- `dist/robots.txt` как `/robots.txt`
- `dist/assets/programmatic.css` как `/assets/programmatic.css`

`dist/index.html` можно использовать как технический hub для проверки, но не обязательно делать его главной страницей сайта.

## Рекомендуемый workflow для 1000 страниц

1. Собери `3000-10000` сырых ключей.
2. Сгруппируй их по кластерам и интенту.
3. Оставь `500-1500` URL с действительно разными задачами пользователя.
4. Для каждой страницы подготовь:
   - заголовок
   - интро
   - секцию выбора
   - FAQ
   - related pages
   - CTA
5. Сгенерируй страницы.
6. Перелей их в хостинг.
7. Отправь `sitemap.xml` в Search Console.

## Принципы сильной programmatic SEO-страницы

- Нельзя менять только ключ в `H1`.
- Нужно менять смысловой каркас.
- Один URL = один основной интент.
- Блок "что это / кому подходит / как выбрать / FAQ" должен реально отличаться.
- Не обещай медицинский эффект без осторожных формулировок.

## Полезные заметки

- Для здоровья и добавок лучше избегать агрессивных medical claims.
- Лучше использовать "поддержка", "может помочь", "как выбрать", "что учитывать".
- Для масштабирования дальше можно перейти на:
  - `Next.js + static export`
  - `Astro`
  - `Eleventy`
  - `Python static site generator`

## Быстрый старт

```bash
python scripts/expand_keywords.py
python scripts/import_google_sheets_csv.py
python scripts/generate_pages.py
```

## Практическая структура Google Sheets

Лучше держать минимум 3 листа:

1. `pages`
   Основной лист для генерации страниц.

2. `clusters`
   Таблица кластеров и групп запросов.

3. `ideas`
   Сырые long-tail ключи, которые еще не прошли отбор.

### Лист `pages`

Одна строка = один URL.

Минимальные колонки:

```text
slug | keyword | category | intent | title | meta_description | h1 | intro | benefits | how_to_choose | faq_q1 | faq_a1 | faq_q2 | faq_a2 | faq_q3 | faq_a3 | cta_primary | cta_secondary | image_url | body_md | status
```

### Рекомендуемые правила для таблицы

- `slug` всегда уникальный
- `title` до 55-65 символов
- `meta_description` обычно до 140-160 символов
- `h1` можно делать длиннее и естественнее
- `benefits` хранить через `|`
- `image_url` лучше вести как прямую ссылку на изображение `https://...`
- `body_md` удобно использовать для блоков `## Заголовок` и списков `- пункт`
- не смешивать несколько интентов в одной строке
- не делать две строки с почти одинаковым смыслом

## Что нажимать в Google Sheets

1. Импортируй [data/google_sheets_template.csv](C:\Users\admin\Desktop\iherbs\data\google_sheets_template.csv) в новый Google Sheet.
2. Заполни строки.
3. Нажми `Файл -> Скачать -> CSV`.
4. Сохрани файл как:

```text
data/google_sheets_export.csv
```

5. Запусти:

```bash
python scripts/import_google_sheets_csv.py
python scripts/generate_pages.py
```

## Как масштабировать до 1000 страниц через таблицу

Рабочий подход:

1. На лист `ideas` складываешь сырье из Search Console, Ahrefs, autosuggest и seed-комбинаций.
2. На листе `clusters` отмечаешь группу и интент.
3. В `pages` переносишь только хорошие кандидаты.
4. Ставишь `draft` тем, что еще не готовы.
5. Ставишь `ready` после проверки.
6. Генератор публикует только `ready/published`.

Такой режим намного безопаснее, чем генерировать все подряд без фильтра.

Следующим этапом в проект уже добавлены:

- генерация страниц по `OpenAI API`
- автокластеризация ключей
- импорт из Search Console
- генерация страниц брендов, ингредиентов, симптомов, аудиторий и форм-факторов

## New Automation Pipeline

Теперь у проекта есть полный промежуточный pipeline между сырьем запросов и `data/keywords.csv`.

### 1. Импортировать Search Console

CSV export:

```bash
python scripts/import_search_console.py
```

API mode c access token:

```bash
python scripts/import_search_console.py --site-url "sc-domain:iherbs.com.md" --access-token "$TOKEN"
```

На выходе:

```text
data/search_console_ideas.csv
```

### 2. Автокластеризовать ключи

```bash
python scripts/auto_cluster_keywords.py
```

Скрипт присваивает:

- `page_type`
- `entity_type`
- `entity_name`
- `cluster_label`
- `intent`
- `category`

Поддерживаемые типы:

- `brand`
- `ingredient`
- `symptom`
- `audience`
- `form_factor`

### 3. Сгенерировать page rows через OpenAI

```bash
python scripts/generate_pages_openai.py --api-key "$OPENAI_API_KEY"
```

Без API можно сделать детерминированные draft-черновики:

```bash
python scripts/generate_pages_openai.py --fallback-only
```

На выходе:

```text
data/keywords.generated.csv
```

Потом можно:

- заменить `data/keywords.csv`
- либо перенести лучшие строки вручную в Google Sheets / `keywords.csv`

### 4. Финальная публикация

```bash
python scripts/generate_pages.py
```

## New Data Columns

В табличную схему добавлены новые поля:

```text
page_type | entity_type | entity_name | cluster_label | source | source_url | impressions | clicks | ctr | position
```

Они опциональны для ручного заполнения, но используются новыми скриптами автоматизации.
