# Furniture Store Training API

Simple NestJS + Prisma training backend for a Front-End React course.

## Modules

- Categories CRUD
- Products CRUD
- Cart
- JWT Authentication
- Roles: ADMIN / USER

## Authentication endpoints

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/auth/admin
```

### Seed accounts

```text
ADMIN
admin@example.com
Admin123!

USER
student@example.com
Student123!
```

Register always creates a USER account.

Login returns:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": 1,
    "name": "Training Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

Protected requests use:

```text
Authorization: Bearer ACCESS_TOKEN
```

## Authorization behavior

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

This gives the Front-End session clear examples for:

```text
401 → not logged in / invalid token
403 → logged in but role is not ADMIN
```

Cart remains unchanged so previous course exercises keep working.

## Setup

```bash
npm install
npm run setup
npm run start:dev
```

Environment:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET="training-jwt-secret"
```

Swagger:

```text
http://localhost:3000/api/docs
```

For protected endpoints in Swagger:

1. Login.
2. Copy `accessToken`.
3. Click **Authorize**.
4. Paste the token.
5. Test ADMIN-only endpoints.
