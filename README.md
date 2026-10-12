# Furniture Store Training API

Simple NestJS + Prisma training backend for the React course.

## Health

```text
GET /api/health
```

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/auth/admin
```

Training accounts are created automatically on app startup:

```text
ADMIN
admin@example.com
Admin123!

USER
student@example.com
Student123!
```

## Authorization

Public:

```text
GET /api/products
GET /api/products/:id
GET /api/categories
GET /api/categories/:id
```

ADMIN only:

```text
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id

POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

Protected requests use:

```text
Authorization: Bearer ACCESS_TOKEN
```

This lets students test:

```text
401 → missing / invalid token
403 → valid USER token but ADMIN permission required
```

## Deployment notes

The Docker container runs:

```bash
npx prisma db push --accept-data-loss
npm run start:prod
```

The auth implementation intentionally uses Node built-in crypto so deployment does not depend on extra JWT/password libraries.

## Swagger

```text
/api/docs
```
