# Деплой на VPS (быстрый путь)

Стек: **Next.js 16** (`next start`) за **nginx**, процесс держит **systemd**, TLS от **certbot**.
Данные — файловые: SQLite `kret.db` + папка загрузок. Внешняя БД не нужна.

Готовые файлы в репозитории:
- [`deploy/nginx.conf`](deploy/nginx.conf) — reverse proxy
- [`deploy/kret.service`](deploy/kret.service) — systemd-юнит
- [`.env.production.example`](.env.production.example) — шаблон переменных

Дальше — Ubuntu 22.04/24.04, домен `kret-manufaktur.de`. Меняй под себя.

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

# Код
sudo git clone <URL_РЕПОЗИТОРИЯ> /opt/kret-manufaktur
cd /opt/kret-manufaktur
sudo chown -R www-data:www-data /opt/kret-manufaktur
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
COOKIE_SECURE=true
```
> Важно: без символа `$` в значениях — Next разворачивает `$name` как переменную.

## 4. Установка и сборка

```bash
cd /opt/kret-manufaktur
sudo -u www-data npm ci
sudo -u www-data npm run build     # postbuild сам сгенерит sitemap
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

## 6. nginx + HTTPS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/kret-manufaktur.conf
sudo ln -s /etc/nginx/sites-available/kret-manufaktur.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # убрать заглушку, если мешает
sudo nginx -t && sudo systemctl reload nginx

# TLS (перед этим A/AAAA-записи домена должны указывать на сервер)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d kret-manufaktur.de -d www.kret-manufaktur.de
```
certbot сам допишет 443-сервер и редирект с HTTP на HTTPS в конфиг и настроит авто-продление.

Открывай `https://kret-manufaktur.de`. Админка — `https://kret-manufaktur.de/admin/login`.

---

## Обновление (редеплой)

```bash
cd /opt/kret-manufaktur
sudo -u www-data git pull
sudo -u www-data npm ci
sudo -u www-data npm run build
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
| Сервис не стартует | `journalctl -u kret -e` (частая причина — пустой `SESSION_SECRET`, нужен ≥ 32 симв.) |
| 502 в браузере | `systemctl status kret`, `curl -I http://127.0.0.1:3000` |
| Загрузка файла в админке → 413 | поднять `client_max_body_size` в `deploy/nginx.conf` |
| Не логинит в админку | сгенерировать хэш заново тем же `hash-password.mjs`, вписать в `.env.production`, `restart kret` |

## Опционально: меньше вес деплоя

В [`next.config.ts`](next.config.ts) можно включить `output: 'standalone'` — тогда деплоится
самодостаточная сборка `.next/standalone` (запуск `node .next/standalone/server.js`) без полного
`node_modules`. Для быстрого старта не обязательно.
