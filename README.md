# Furniture Store Training API

Simple NestJS + Prisma training backend for the React course.

## Important runtime behavior

Dokploy runtime logs showed that the application was being started with:

```text
npm run prisma:seed
```

instead of the normal Nest startup command.

To make the deployment resilient, both supported startup paths now initialize the SQLite schema and then keep the API process running.

### Docker entrypoint

```text
1. prisma db push
2. prisma db seed
3. node dist/main.js
```

### If Dokploy forces this command

```bash
npm run prisma:seed
```

it now performs:

```text
1. prisma db push
2. prisma db seed
3. node dist/main.js
```

So it no longer exits after seeding.

The seed is idempotent:
- categories use upsert
- demo products are created only when there are no products
- existing CRUD training data is not deleted on every restart

## Environment

```env
PORT=3000
DATABASE_URL=file:/data/dev.db
JWT_SECRET=training-jwt-secret
```

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
