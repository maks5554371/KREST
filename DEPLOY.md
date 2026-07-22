# Деплой на VPS (быстрый путь)

Стек: **Next.js 16** (`next start`) за **nginx**, процесс держит **systemd**.
Данные — файловые: SQLite `kret.db` + папка загрузок. Внешняя БД не нужна.

**Дев-режим:** VPS на голом IP, **без домена и без HTTPS** — сайт по `http://<SERVER-IP>`.
HTTPS добавляется позже, когда появится домен (см. последнюю секцию).

Готовые файлы в репозитории:
- [`deploy/nginx.conf`](deploy/nginx.conf) — reverse proxy (по IP, порт 80)
- [`deploy/kret.service`](deploy/kret.service) — systemd-юнит
- [`.env.production.example`](.env.production.example) — шаблон переменных

Дальше — Ubuntu 22.04/24.04. `<SERVER-IP>` замени на IP своего VPS.

---

## 1. Подготовка сервера

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx

# Node 20 LTS (нужен для Next 16)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x
```

## 2. Код и постоянные данные

```bash
# Каталог для БД и загрузок — ВНЕ репозитория, чтобы переживал редеплой
sudo mkdir -p /var/lib/kret/uploads
sudo chown -R www-data:www-data /var/lib/kret

# Код (клонируем от root; права www-data назначим после сборки)
sudo git clone <URL_РЕПОЗИТОРИЯ> /opt/kret-manufaktur
cd /opt/kret-manufaktur
```

## 3. Переменные окружения

```bash
cd /opt/kret-manufaktur

# Сгенерировать хэш пароля админки + SESSION_SECRET
node scripts/hash-password.mjs "<надёжный-пароль-для-/admin>"
# → выведет строки ADMIN_PASSWORD_HASH="..." и SESSION_SECRET="..."

cp .env.production.example .env.production
sudo -u www-data nano .env.production   # вставить оба значения из вывода выше
```

`.env.production` (пути уже прописаны в шаблоне):
```
DATABASE_PATH=/var/lib/kret/kret.db
UPLOAD_PATH=/var/lib/kret/uploads
ADMIN_PASSWORD_HASH=scrypt:...
SESSION_SECRET=...
COOKIE_SECURE=false
```
> Важно: без символа `$` в значениях — Next разворачивает `$name` как переменную.
>
> ⚠️ На голом IP по http `COOKIE_SECURE=false` **обязательно** — иначе браузер не
> отправит cookie сессии и в админку не залогиниться. Ставь `true` только вместе с HTTPS.

## 4. Установка и сборка

Установку и сборку делаем **от root** — у www-data нет доступной npm-кэш-папки
(`/var/www/.npm`), из-за чего `npm ci` падает с `EACCES`.

```bash
cd /opt/kret-manufaktur
sudo npm ci
sudo npm run build                 # postbuild сам сгенерит sitemap

# Права для рантайма: сервис работает под www-data и должен писать в .next/cache
# (кэш оптимизации картинок next/image). Поэтому весь каталог отдаём www-data.
sudo chown -R www-data:www-data /opt/kret-manufaktur
```
БД создаётся и мигрируется автоматически при первом запросе.

## 5. Запуск через systemd

```bash
sudo cp deploy/kret.service /etc/systemd/system/kret.service
sudo systemctl daemon-reload
sudo systemctl enable --now kret
sudo systemctl status kret         # должно быть active (running)
curl -I http://127.0.0.1:3000      # 200
```

## 6. nginx (по IP, без домена)

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/kret.conf
sudo ln -s /etc/nginx/sites-available/kret.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # убрать дефолтный default_server
sudo nginx -t && sudo systemctl reload nginx
```
Конфиг слушает порт 80 как `default_server` с `server_name _;` — принимает запросы
на голый IP без домена. Не забудь открыть порт 80 в фаерволе:
```bash
sudo ufw allow 80/tcp    # если ufw включён
```

Открывай `http://<SERVER-IP>`. Админка — `http://<SERVER-IP>/admin/login`.

---

## Опционально: наполнить каталог демо-товарами

Если каталог пустой, можно засеять 6 демо-товаров (плейсхолдер-фото, потом
правишь/заменяешь через `/admin`). Скрипт сам берёт `DATABASE_PATH` из
`.env.production`, поэтому пишет в ту же БД, что и приложение.

**Важно:** сначала сервис должен хотя бы раз стартовать — таблицы создаются
миграциями при первом обращении к БД.

```bash
cd /opt/kret-manufaktur
# 1) один раз дёрнуть сайт, чтобы прошли миграции
sudo systemctl start kret && curl -s localhost:3000/katalog >/dev/null
# 2) засеять (от www-data, чтобы файл БД остался за www-data)
sudo -u www-data node scripts/seed-demo-products.mjs
```

Удалить демо-товары: `sudo -u www-data node scripts/seed-demo-products.mjs --clean`.
(Локально то же самое короче: `npm run seed` / `npm run seed:clean`.)

## Обновление (редеплой)

```bash
cd /opt/kret-manufaktur
sudo git pull
sudo npm ci
sudo npm run build
sudo chown -R www-data:www-data /opt/kret-manufaktur
sudo systemctl restart kret
```
Папка `/var/lib/kret` не трогается — товары, категории и загрузки сохраняются.

## Бэкап

Достаточно копировать один каталог (SQLite + загрузки):
```bash
sudo tar czf kret-backup-$(date +%F).tar.gz -C /var/lib kret
```

## Диагностика

| Симптом | Проверка |
|---|---|
| `npm ci`: EACCES `/var/www/.npm` или `next: not found` | ставить/собирать **от root**, не от www-data: `sudo rm -rf node_modules .next && sudo npm ci && sudo npm run build`, затем `sudo chown -R www-data:www-data /opt/kret-manufaktur` |
| Картинки отдаются битые / 500 на `/_next/image` | `.next` не пишется www-data → `sudo chown -R www-data:www-data /opt/kret-manufaktur` |
| Сервис не стартует | `journalctl -u kret -e` (частая причина — пустой `SESSION_SECRET`, нужен ≥ 32 симв.) |
| 502 в браузере | `systemctl status kret`, `curl -I http://127.0.0.1:3000` |
| Загрузка файла в админке → 413 | поднять `client_max_body_size` в `deploy/nginx.conf` |
| Логин в админку не проходит (по http) | `COOKIE_SECURE=false` в `.env.production`, затем `restart kret` |
| Не логинит в админку | сгенерировать хэш заново тем же `hash-password.mjs`, вписать в `.env.production`, `restart kret` |
| Сайт не открывается по IP | открыт ли порт 80 (`sudo ufw allow 80/tcp`), убран ли дефолтный `default_server` |

## Позже: домен + HTTPS

Когда появится домен и его A/AAAA-записи будут указывать на IP сервера:

```bash
# 1) В deploy/nginx.conf заменить  server_name _;  на свой домен:
#    server_name example.de www.example.de;
#    (строки listen ... default_server можно оставить)
sudo nano /etc/nginx/sites-available/kret.conf
sudo nginx -t && sudo systemctl reload nginx

# 2) Выпустить сертификат — certbot сам добавит 443-сервер и редирект http→https
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.de -d www.example.de

# 3) Включить secure-cookie
sudo -u www-data nano /opt/kret-manufaktur/.env.production   # COOKIE_SECURE=true
sudo systemctl restart kret
```

## Опционально: меньше вес деплоя

В [`next.config.ts`](next.config.ts) можно включить `output: 'standalone'` — тогда деплоится
самодостаточная сборка `.next/standalone` (запуск `node .next/standalone/server.js`) без полного
`node_modules`. Для быстрого старта не обязательно.
