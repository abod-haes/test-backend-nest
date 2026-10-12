# Furniture Store Training API

Simple NestJS + Prisma training backend for the React course.

## Auth for this session

Only two auth endpoints are exposed:

```text
POST /api/auth/login
GET  /api/auth/me
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

Login returns:

```json
{
  "accessToken": "token",
  "user": {
    "id": 1,
    "name": "Training Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

Use the token with:

```text
Authorization: Bearer ACCESS_TOKEN
```

Then call:

```text
GET /api/auth/me
```

Register and the separate /auth/admin demo endpoint are intentionally removed to keep the frontend authentication lesson focused.

## Health

```text
GET /api/health
```

## Swagger

```text
GET /api/docs
```

## Products and Categories

Public reads:

```text
GET /api/products
GET /api/products/:id
GET /api/categories
GET /api/categories/:id
```

ADMIN mutations remain protected:

```text
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id

POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```
