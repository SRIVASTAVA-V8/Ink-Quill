# 📚 Ink&Quill

> **Discover Your Next Great Read**

Ink&Quill is a full-stack online bookstore built with **Angular, Node.js, Express.js, and MongoDB**. It provides a complete e-commerce workflow — from discovering books and managing a shopping cart to checkout, payments, inventory management, and viewing order history.

The project focuses on building a **scalable, responsive, and production-oriented bookstore application** with a clean editorial-inspired user interface.

---

## ✨ Features

### 📖 Book Discovery

- Browse available books
- Explore books by category
- Search and discover books
- View detailed book information
- Featured books
- Bestselling books
- Newly added books

### 🛒 Shopping Cart

- Add books to cart
- Update item quantities
- Remove items from cart
- Automatically calculate cart totals
- Support for guest and authenticated shopping
- Cart management throughout the shopping journey

### 👤 Authentication

- User registration
- User login
- Authenticated user sessions
- User-specific cart and order data

### 📦 Inventory Management

- Manage book inventory and stock availability
- Track available stock
- Update inventory quantities
- Display book availability
- Prevent purchases when books are unavailable or out of stock

### 💳 Checkout & Payments

- Multi-step checkout process
- Personal information collection
- Shipping address management
- Multiple payment methods
- Razorpay payment integration
- Cash on Delivery support
- Secure payment flow

### 📋 Order Management

- Place orders from the checkout flow
- Create and process orders
- View order details
- Track order status
- View complete order history
- Access previously placed orders

### 📱 Responsive Design

- Responsive across desktop, tablet, and mobile
- Clean and modern bookstore-inspired interface
- Tailwind CSS-based styling
- Consistent typography, spacing, and color system

---

## 🛠️ Tech Stack

### Frontend

- **Angular 15**
- **TypeScript**
- **HTML5**
- **Tailwind CSS**
- **Reactive Forms**
- **Angular Router**
- **Material Icons**
- **Lucide Icons**

### Backend

- **Node.js**
- **Express.js**
- **REST APIs**
- **MongoDB**
- **Mongoose**

### Payments

- **Razorpay**

### Development Tools

- Git
- GitHub
- npm
- Postman
- VS Code

---

##  Architecture

Ink&Quill follows a client-server architecture:
```text

                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Angular Frontend   │
                    │      Angular 15      │
                    │   TypeScript + HTML  │
                    │     Tailwind CSS     │
                    └──────────┬───────────┘
                               │
                         HTTP / REST
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │       Node.js        │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    ▼                      ▼
          ┌──────────────────┐   ┌──────────────────┐
          │     MongoDB      │   │     Razorpay     │
          │  Application DB  │   │ Payment Gateway  │
          └──────────────────┘   └──────────────────┘


```
## Application Flow
```text


                         Ink&Quill
                             │
             ┌───────────────┴───────────────┐
             │                               │
             ▼                               ▼
       Browse Books                    User Authentication
             │                               │
       ┌─────┼─────┐                         │
       ▼     ▼     ▼                         ▼
    Search  Category  Details             Account
       │     │     │                         │
       └─────┴─────┘                         │
             │                               │
             ▼                               │
          Add to Cart ◄──────────────────────┘
             │
             ▼
        Manage Cart
             │
             ▼
          Checkout
             │
      ┌──────┼──────┐
      ▼      ▼      ▼
   Personal Shipping Payment
    Info     Info
             │
             ▼
        Place Order
             │
      ┌──────┴──────┐
      ▼             ▼
  Inventory      Order
   Update        Created
                    │
                    ▼
              Order History
                    │
                    ▼
              Order Details
```
## Project Structure
```
Ink&Quill/
│
├── FrontEnd/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── guards/
│   │   │
│   │   ├── assets/
│   │   ├── environments/
│   │   └── styles.css
│   │
│   ├── angular.json
│   ├── package.json
│   └── tailwind.config.js
│
├── BackEnd/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── app.js
│   └── package.json
│
├── .gitignore
└── README.md
```


