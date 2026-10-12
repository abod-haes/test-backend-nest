FROM node:22-alpine

WORKDIR /app

ENV PORT=3000
ENV DATABASE_URL="file:./dev.db"

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --skip-generate || echo 'WARNING: prisma db push failed'; npm run start:prod"]
