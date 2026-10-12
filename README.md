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

For this training backend, auth users are intentionally kept in memory so authentication does not affect the existing Products/Categories SQLite database.

Training accounts:

```text
ADMIN
admin@example.com
Admin123!

USER
student@example.com
Student123!
```

Registered users remain available while the server process is running.

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

## Swagger

```text
/api/docs
```
