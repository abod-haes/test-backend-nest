#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-file:/data/dev.db}"

mkdir -p /data
chmod 777 /data

echo "DATABASE_URL=$DATABASE_URL"

npx prisma db push --skip-generate
npx prisma db seed

exec node dist/main.js
