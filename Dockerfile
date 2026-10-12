FROM node:22-alpine

WORKDIR /app

ENV PORT=3000

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

RUN mkdir -p /data

EXPOSE 3000

CMD ["sh", "-c", "mkdir -p /data && export DATABASE_URL=file:/data/dev.db && npx prisma db push --skip-generate && npm run start:prod"]
