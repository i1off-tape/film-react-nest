# Мой сайт

https://i1off.nomorepartiessite.ru/

# Деплой Film!

Документ описывает, как развернуть проект на сервере через Docker Compose, выпустить SSL-сертификаты, заполнить PostgreSQL и проверить работу фронтенда/бэкенда.

## 1. Что должно быть на сервере

На сервере должны быть установлены:

- Docker
- Docker Compose plugin
- Git

Порты:

- `80` — HTTP, нужен для Let's Encrypt и редиректа на HTTPS
- `443` — HTTPS
- `8080` — pgAdmin, временно для настройки базы

Базу PostgreSQL наружу открывать не нужно. Контейнеры общаются с ней внутри docker-сети.

## 2. Переменные окружения

В корне проекта создаётся `.env` на основе `.env.example`.

Пример:

```env
POSTGRES_USER=prac
POSTGRES_PASSWORD=prac
POSTGRES_DB=prac

VITE_API_URL=https://api.i1off.nomorepartiessite.ru/api/afisha
VITE_CDN_URL=https://api.i1off.nomorepartiessite.ru/content/afisha

PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
PGADMIN_PORT=8080

OWNER=i1off-tape

NODE_ENV=production
LOGGER_FORMAT=tskv
DEBUG=*
```

Важно: для Docker Compose используются именно переменные из корневого `.env`, потому что `docker-compose.yml` находится в корне проекта.

## 3. Nginx и первый запуск

Для первого выпуска сертификата nginx должен стартовать без HTTPS-конфига, потому что файлов сертификата ещё нет.

Временный `nginx/nginx.conf`:

```nginx
server {
  listen 80;
  server_name i1off.nomorepartiessite.ru api.i1off.nomorepartiessite.ru;

  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  location / {
    return 200 'ok';
  }
}
```

Запуск контейнеров:

```bash
docker compose pull
docker compose up -d
```

Проверка:

```bash
curl http://i1off.nomorepartiessite.ru
curl http://api.i1off.nomorepartiessite.ru
```

Оба адреса должны отвечать `ok`.

## 4. Выпуск SSL

Сертификат выпускается один раз на оба домена:

```bash
docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d i1off.nomorepartiessite.ru \
  -d api.i1off.nomorepartiessite.ru \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

После успешного выпуска сертификаты появятся в:

```text
./certbot/conf/live/i1off.nomorepartiessite.ru/
```

## 5. Полный nginx.conf после SSL

После выпуска сертификата нужно вернуть полный конфиг nginx:

```nginx
server {
  listen 80;
  server_name i1off.nomorepartiessite.ru api.i1off.nomorepartiessite.ru;

  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  location / {
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl;
  server_name i1off.nomorepartiessite.ru;

  ssl_certificate /etc/letsencrypt/live/i1off.nomorepartiessite.ru/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/i1off.nomorepartiessite.ru/privkey.pem;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}

server {
  listen 443 ssl;
  server_name api.i1off.nomorepartiessite.ru;

  ssl_certificate /etc/letsencrypt/live/i1off.nomorepartiessite.ru/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/i1off.nomorepartiessite.ru/privkey.pem;

  location /api/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /content/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    return 404;
  }
}
```

Перезапуск nginx:

```bash
docker compose restart nginx
```

## 6. Заполнение PostgreSQL

После запуска контейнера PostgreSQL нужно создать таблицы и загрузить тестовые данные.

```bash
docker exec -i film-postgres psql -U prac -d prac < backend/test/prac.init.sql
docker exec -i film-postgres psql -U prac -d prac < backend/test/prac.films.sql
docker exec -i film-postgres psql -U prac -d prac < backend/test/prac.shedules.sql
```

Если база уже создана контейнером через `POSTGRES_DB`, а в `prac.init.sql` есть `CREATE DATABASE`, эту строку лучше убрать или закомментировать.

Проверка таблиц:

```bash
docker compose exec postgres psql -U prac -d prac -c "\dt"
docker compose exec postgres psql -U prac -d prac -c "select count(*) from films;"
docker compose exec postgres psql -U prac -d prac -c "select count(*) from schedules;"
```

## 7. pgAdmin

Админка доступна по адресу:

```text
http://SERVER_IP:8080
```

Логин и пароль берутся из `.env`:

```env
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
```

Подключение к базе внутри pgAdmin:

- Host: `postgres`
- Port: `5432`
- Maintenance database: `prac`
- Username: `prac`
- Password: `prac`

После настройки лучше закрыть публичный доступ к pgAdmin. Можно оставить порт только локально:

```yaml
ports:
  - '127.0.0.1:8080:80'
```

И подключаться через SSH-тоннель:

```bash
ssh -L 8080:localhost:8080 user@SERVER_IP
```

## 8. Проверка приложения

Фронтенд:

```text
https://i1off.nomorepartiessite.ru
```

Бэкенд:

```text
https://api.i1off.nomorepartiessite.ru/api/afisha/films
```

Статика:

```text
https://api.i1off.nomorepartiessite.ru/content/afisha/<image-name>
```

Проверка логов:

```bash
docker compose logs -f backend
docker compose logs -f nginx
docker compose logs -f postgres
```

## 9. Обновление приложения

После нового коммита GitHub Actions собирает и публикует образы в GHCR.

На сервере:

```bash
git pull
docker compose pull
docker compose up -d
```

Если менялся nginx-конфиг:

```bash
docker compose restart nginx
```

## 10. Продление SSL

Ручная проверка:

```bash
docker compose run --rm --entrypoint certbot certbot renew --dry-run
```

Ручное продление:

```bash
docker compose run --rm --entrypoint certbot certbot renew
docker compose exec nginx nginx -s reload
```

Для автоматического продления можно добавить cron на сервере:

```cron
0 3 * * * cd /home/i1off/film-react-nest && docker compose run --rm --entrypoint certbot certbot renew && docker compose exec nginx nginx -s reload
```

## 11. UFW

Минимальная настройка фаервола:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Порт PostgreSQL `5432` открывать наружу не нужно.

Порт pgAdmin `8080` лучше открывать только временно или использовать SSH-тоннель.
