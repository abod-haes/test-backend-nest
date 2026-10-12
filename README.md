# Furniture Store Training API

Simple NestJS + Prisma training backend for the React course.

## Production startup

The image uses a fixed Docker ENTRYPOINT:

```text
/app/docker-entrypoint.sh
```

It always performs:

```text
1. ensure /data exists
2. prisma db push
3. start Nest with node dist/main.js
```

This intentionally prevents an external Docker command override from replacing the API process with a one-time command such as `npm run prisma:seed`.

Environment:

```env
PORT=3000
DATABASE_URL=file:/data/dev.db
JWT_SECRET=training-jwt-secret
```

## One-time sample data

Run this manually only when you want to reset and seed the training database:

```bash
npm run db:setup
```

Do not use `npm run prisma:seed` as the application's startup command.

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
