# Furniture Store Training API

NestJS + Prisma + SQLite backend for the React furniture-store training project.

## What is included

- Persistent user login
- GET /auth/me
- Categories CRUD
- Products CRUD
- Product search and filters
- Pagination and sorting
- Random similar products
- User-specific cart
- Quantity and stock validation
- Cart totals and discounts
- Checkout
- Order creation and history
- Swagger

## Training users

```text
ADMIN
admin@example.com
Admin123!

USER
student@example.com
Student123!
```

## Auth

```text
POST /api/auth/login
GET  /api/auth/me
```

Login returns:

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

Protected endpoints use:

```text
Authorization: Bearer TOKEN
```

## Storefront products

```text
GET /api/products
```

Supported query parameters:

```text
categoryId
search
minPrice
maxPrice
color
minDiscount
maxDiscount
page
limit
sortBy=id|name|price|discountPercent|createdAt
sortOrder=asc|desc
```

Example:

```text
GET /api/products?categoryId=2&minPrice=20&maxPrice=100&color=Gray&page=1&limit=9&sortBy=price&sortOrder=asc
```

Response:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 9,
    "total": 0,
    "totalPages": 0,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

Similar products:

```text
GET /api/products/:id/similar?limit=4
```

Results are randomly shuffled from the same category on each request.

## User cart

All cart endpoints require login.

```text
POST   /api/cart
GET    /api/cart
PATCH  /api/cart/:cartItemId
DELETE /api/cart/:cartItemId
DELETE /api/cart
```

Add:

```json
{
  "productId": 1,
  "quantity": 1
}
```

The cart is now isolated per logged-in user.

## Checkout and orders

```text
POST /api/orders/checkout
GET  /api/orders
GET  /api/orders/:id
```

Checkout example:

```json
{
  "shippingName": "Ahmad Ali",
  "shippingAddress": "Mirpur-10, Road 14A",
  "shippingCity": "Dhaka",
  "shippingPhone": "0175817028",
  "paymentMethod": "CASH",
  "promoCode": "SAVE20"
}
```

Checkout:

1. validates cart stock
2. calculates product discounts
3. applies SAVE20 when supplied
4. adds the training delivery fee
5. creates an immutable order snapshot
6. decreases product stock
7. clears only the current user's cart

### Card payments

The training API accepts `paymentMethod: "CARD"`, but intentionally does **not** store card number, expiration date or CVV.

A production project should send card details directly to a PCI-compliant payment provider and send only the provider payment token/id to this backend.

## Compatibility note

The old `CartItem` Prisma model is kept as a legacy table so the existing SQLite database does not need to be destructively reset. New cart APIs use `UserCartItem`.

## Run

```bash
npm install
npm run prisma:generate
npm run db:setup
npm run start:dev
```

## Swagger

```text
/api/docs
```

## Product color enum

The backend uses `ProductColor` values for both product create/update and filtering.
The SQLite `Product.color` column remains `String?` for compatibility with existing
data. The Nest DTOs validate color against the shared TypeScript enum.

Public endpoint for building the filter UI:

```http
GET /api/products/colors
```

Response:

```json
[
  {"value":"Black","label":"Black","hex":"#171717"},
  {"value":"White","label":"White","hex":"#FFFFFF"},
  {"value":"Gray","label":"Gray","hex":"#9CA3AF"}
]
```

(The real endpoint returns every supported color, not just these three examples.)

Filter using the exact `value` field, with case preserved:

```http
GET /api/products?color=Gray&page=1&limit=9
```

Create/update products with `"color":"Gray"`, not `"color":"GRAY"`
or arbitrary text. Invalid values return HTTP 400.
