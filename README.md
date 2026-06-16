# Ecommerce Store API

## Project Overview

This project implements a simple ecommerce backend using NestJS.

Customers can:

* View available products
* Add products to their cart
* Checkout and place orders
* Apply discount coupons during checkout
* Earn discount coupons based on order milestones

Administrators can:

* Generate discount coupons
* View store statistics

The application uses an in-memory data store as required by the assignment. No external database is required.

---

## Tech Stack

* NestJS
* TypeScript
* Jest
* Class Validator
* Class Transformer

---

## Architecture

The application follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
In-Memory Store
```

### Modules

```text
src/modules

├── admin
├── carts
├── discounts
├── orders
├── products
```

### Shared Components

```text
src/shared

├── constants
├── interfaces
├── store
```

### Data Storage

The application uses an in-memory store located in:

```text
src/shared/store/data.store.ts
```

The store maintains:

* Users
* Products
* Carts
* Orders
* Coupons

---

## Setup Instructions

### Clone Repository

```bash
git clone <repository-url>
cd ecommerce-store
```

### Install Dependencies

```bash
npm install
```

---

## Running Application

Start development server:

```bash
npm run start:dev
```

Application will run on:

```text
http://localhost:3000
```

---

## Running Tests

Run unit tests:

```bash
npm run test
```

Run test coverage:

```bash
npm run test:cov
```

---

## API Endpoints

### Products

#### Get Products

```http
GET /products
```

---

### Cart

#### Add Items To Cart

```http
POST /cart
```

Request:

```json
{
  "userId": "u-1001",
  "items": [
    {
      "productId": "p-2001",
      "quantity": 2
    }
  ]
}
```

#### Get User Cart

```http
GET /users/:userId/cart
```

---

### Orders

#### Checkout

```http
POST /checkout
```

Request:

```json
{
  "userId": "u-1001",
  "couponCode": "SAVE15"
}
```

---

### Coupons

#### Get User Coupons

```http
GET /users/:userId/coupons
```

---

### Admin

#### Generate Coupon

```http
POST /admin/:adminId/generate-discount
```

#### Get Store Statistics

```http
GET /admin/:adminId/stats
```

Returns:

* Total items purchased
* Total revenue
* Total discount codes generated
* Total discounts given

---

## Assumptions

* Users and products are pre-seeded in memory.
* Coupons are user-specific.
* Coupons can only be used once.
* Cart items are not reserved when added to cart.
* Stock validation occurs during checkout.
* Data is not persisted between application restarts.
* Admin users are predefined in the in-memory store.

---

## Discount System

The discount system rewards customers based on order count.

Configuration:

```ts
export const DISCOUNT_CONFIG = {
  EVERY_NTH_ORDER: 3,
  DISCOUNT_PERCENTAGE: 15,
};
```

Behavior:

* Every 3rd order generates a coupon.
* Generated coupon provides 15% discount.
* Coupons can be applied during checkout.
* Coupons are marked as used after successful checkout.

---

## Future Improvements

* Add persistent database support (PostgreSQL/MySQL).
* Implement authentication and authorization.
* Add inventory reservation support.
* Add order history APIs.
* Add coupon expiration support.
* Add end-to-end tests.
* Add frontend application.

---

## Postman Collection

The Postman collection is available at:

postman/ecommerce-store.postman_collection.json

Import it into Postman to test all APIs.

## NOTES

Unit tests are included for core business logic, including:

* Cart operations
* Checkout flow
* Coupon validation
* Reward coupon generation
* Admin statistics




```
```
