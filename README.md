# Furniture Store Training API

Simple NestJS + Prisma training backend for the React course.

## Auth for this session

Only:

```text
POST /api/auth/login
GET  /api/auth/me
```

Login:

```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

Response:

```json
{
  "token": "jwt-token",
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
Authorization: Bearer TOKEN
```

Then:

```text
GET /api/auth/me
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

## Health

```text
GET /api/health
```

## Swagger

```text
GET /api/docs
```
