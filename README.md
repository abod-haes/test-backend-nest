# Furniture Store Training API

Simple NestJS + Prisma training backend for the React course.

## Production environment

```env
PORT=3000
DATABASE_URL=file:/data/dev.db
```

The container now starts Nest directly:

```text
node dist/main.js
```

Database schema changes should be applied separately from application startup. This prevents a Prisma setup error from killing the whole API and producing a reverse-proxy 502.

## Health

```text
GET /api/health
```

## Swagger

```text
GET /api/docs
```

## Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/auth/admin
```

Training accounts:

```text
ADMIN
admin@example.com
Admin123!

USER
student@example.com
Student123!
```

## Public reads

```text
GET /api/products
GET /api/products/:id
GET /api/categories
GET /api/categories/:id
```

## ADMIN mutations

```text
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id

POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```
