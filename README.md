# Furniture Store Training API

A small NestJS backend for students who are learning how to connect a frontend to a real API.

It intentionally keeps the project simple:

- Categories CRUD
- Products CRUD
- Product description
- Product category relation
- Filter products by category
- Add to cart
- Change cart quantity
- Remove from cart
- Clear cart
- SQLite database
- Prisma ORM
- Swagger with request examples
- Validation with class-validator
- No authentication
- No product colors
- One shared cart for training purposes

## Run the project

Requirements: Node.js 20+

```bash
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

On Windows, create `.env` manually and copy the content from `.env.example`.

Prepare the database and seed example furniture data:

```bash
npm run setup
```

Start NestJS:

```bash
npm run start:dev
```

## Swagger

Open:

```text
http://localhost:3000/api/docs
```

Swagger contains examples for the important request bodies.

## Base URL

```text
http://localhost:3000/api
```

## Main endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | /categories | Create category |
| GET | /categories | Get categories |
| GET | /categories/:id | Get one category |
| PATCH | /categories/:id | Update category |
| DELETE | /categories/:id | Delete category |
| POST | /products | Create product |
| GET | /products | Get products |
| GET | /products?categoryId=1 | Filter products by category |
| GET | /products/:id | Get one product |
| PATCH | /products/:id | Update product |
| DELETE | /products/:id | Delete product |
| POST | /cart | Add product to cart |
| GET | /cart | Get cart and totals |
| PATCH | /cart/:id | Change quantity |
| DELETE | /cart/:id | Remove item |
| DELETE | /cart | Clear cart |

## Create category example

```json
{
  "name": "Living Room",
  "description": "Sofas, chairs and living room furniture"
}
```

## Create product example

There is no colors field. The product has a simple `description`.

```json
{
  "name": "Stylish Soft Chair",
  "description": "A comfortable soft chair for modern living rooms.",
  "price": 20,
  "imageUrl": "https://placehold.co/600x400?text=Chair",
  "categoryId": 1
}
```

## Add to cart example

```json
{
  "productId": 1,
  "quantity": 2
}
```

If the same product is added again, the API increases its quantity instead of creating a duplicate cart row.

## Update cart quantity example

```json
{
  "quantity": 3
}
```

## Suggested frontend flow

1. Call `GET /api/categories` to render category buttons.
2. Call `GET /api/products` for "All Furniture".
3. Call `GET /api/products?categoryId=ID` when a category is selected.
4. Call `POST /api/cart` when the user clicks "Add to cart".
5. Call `GET /api/cart` to render the cart and totals.

This project is intentionally small so students can focus on HTTP methods, DTOs, controllers, services, Prisma and frontend integration.
