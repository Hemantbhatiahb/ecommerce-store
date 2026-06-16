# DECISIONS.md

## Decision: Use In-Memory Storage

**Context:**
The assignment required implementing an ecommerce backend and explicitly stated that an in-memory store was acceptable.

**Options Considered:**

* Option A: Use PostgreSQL or SQLite for persistence.
* Option B: Use an in-memory data store.

**Choice:**
Use an in-memory data store.

**Why:**
The goal of the assignment was to focus on business logic, API design, and code structure rather than database setup and persistence. Using an in-memory store reduced implementation complexity and allowed more time to focus on checkout, discounts, and testing. The repository layer was still introduced so a database could be added later with minimal changes.

---

## Decision: Coupons Are User-Specific

**Context:**
The system rewards customers with discount coupons based on order activity.

**Options Considered:**

* Option A: Allow any customer to use any valid coupon.
* Option B: Associate each coupon with a specific user.

**Choice:**
Coupons are assigned to a specific user.

**Why:**
The requirement describes coupons as customer rewards. User-specific coupons prevent coupon sharing and abuse while making reward ownership explicit. This also simplifies coupon validation during checkout because ownership can be verified directly.

---

## Decision: Coupons Are Single-Use

**Context:**
The checkout process supports applying discount coupons.

**Options Considered:**

* Option A: Allow coupons to be reused multiple times.
* Option B: Mark coupons as used after successful checkout.

**Choice:**
Coupons are single-use.

**Why:**
Single-use coupons are easier to track and align with typical ecommerce reward systems. It prevents repeated discounts from the same coupon and simplifies revenue and discount reporting.

---

## Decision: Validate Stock During Checkout

**Context:**
Inventory validation can occur either when items are added to the cart or when the customer places the order.

**Options Considered:**

* Option A: Validate stock during Add To Cart.
* Option B: Validate stock during Checkout.

**Choice:**
Validate stock during Checkout.

**Why:**
Adding an item to a cart does not reserve inventory. Stock levels may change while a user is browsing or before they complete checkout. Performing stock validation during checkout ensures inventory is verified against the latest available quantity before creating an order.

---

## Decision: Use Repository Pattern With In-Memory Storage

**Context:**
The application needed a structure that would remain maintainable as features grew.

**Options Considered:**

* Option A: Access the in-memory store directly from services.
* Option B: Introduce repository classes between services and storage.

**Choice:**
Use repositories.

**Why:**
Repositories isolate data access concerns from business logic. Services focus on workflows and validation, while repositories manage data retrieval and persistence. This separation improves readability, testability, and makes future migration to a database significantly easier.

---

## Decision: Generate Reward Coupons Automatically After Qualifying Orders

**Context:**
The system must reward customers every Nth order.

**Options Considered:**

* Option A: Create a separate admin process to generate reward coupons.
* Option B: Automatically generate coupons during checkout when the order threshold is reached.

**Choice:**
Automatically generate reward coupons as part of checkout.

**Why:**
The reward is generated immediately after the qualifying order is completed, providing instant feedback to the customer and eliminating the need for additional manual steps or background processes. This keeps the reward flow simple and predictable.

```
```
