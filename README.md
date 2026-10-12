# Furniture Store Training API

Simple NestJS + Prisma training backend for the React course.

## Important deployment setting

SQLite uses an absolute runtime path:

```env
DATABASE_URL="file:/data/dev.db"
PORT=3000
```

Do not use:

```env
DATABASE_URL="file:./data/dev.db"
```

because Prisma resolves relative SQLite paths from the Prisma schema location, not from the container root.

The Docker container explicitly creates `/data` and uses:

```text
file:/data/dev.db
```

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

Training accounts:

```text
ADMIN
admin@example.com
Admin123!

USER
student@example.com
Student123!
```

## Swagger

```text
/api/docs
```
