# BookVerse - Enterprise Virtual Bookstore

A production-ready, enterprise-grade Virtual Bookstore application built with **React.js + Tailwind CSS** (frontend) and **Spring Boot + Spring Security + JWT + MySQL** (backend).

---

## 🚀 Tech Stack

### Frontend
- **React.js 18** — Component-based UI
- **Tailwind CSS** — Utility-first responsive styling
- **React Router v6** — Client-side routing
- **Axios** — API communication
- **Recharts** — Analytics charts
- **React Hot Toast** — Beautiful notifications
- **Lucide React** — Icon library

### Backend
- **Spring Boot 3.2** — Core framework
- **Spring Security 6** — Authentication & authorization
- **JWT (jjwt)** — Stateless token-based auth
- **Spring Data JPA** — Database ORM
- **MySQL 8** — Relational database
- **Lombok** — Boilerplate reduction
- **BCrypt** — Password hashing

---

## 📁 Project Structure

```
virtual book store/
├── backend/                        # Spring Boot Application
│   └── src/main/java/com/bookstore/
│       ├── config/                 # SecurityConfig, DataInitializer
│       ├── controller/             # AuthController, BookController, UserController, AdminController
│       ├── dto/                    # Request/Response DTOs
│       ├── entity/                 # User, Book, Order, OrderItem, enums
│       ├── exception/              # GlobalExceptionHandler, custom exceptions
│       ├── repository/             # JPA Repositories
│       ├── security/               # JwtUtil, JwtAuthFilter
│       └── service/                # AuthService, BookService, OrderService, AdminService
│
└── frontend/                       # React Application
    └── src/
        ├── components/
        │   ├── books/              # BookCard, BookCatalog
        │   ├── common/             # Shared UI components
        │   └── layout/             # Navbar, Footer
        ├── context/                # AuthContext, CartContext, ThemeContext
        ├── pages/
        │   ├── auth/               # Login, Register, ForgotPassword
        │   ├── user/               # Dashboard, BookDetail, Cart, Checkout, Orders
        │   └── admin/              # Dashboard, Books, Orders, Users, AdminLayout
        └── services/               # API service layer
```

---

## 🔧 Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+**
- **MySQL 8.0+**

---

## ⚙️ Setup & Installation

### 1. Database Setup
```sql
CREATE DATABASE virtual_bookstore;
```

### 2. Backend Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### 3. Run Backend
```bash
cd backend
mvn spring-boot:run
```
Backend starts at: `http://localhost:8080/api`

### 4. Run Frontend
```bash
cd frontend
npm install
npm start
```
Frontend starts at: `http://localhost:3000`

---

## 🔐 Demo Credentials

| Role  | Email                   | Password  |
|-------|-------------------------|-----------|
| Admin | admin@bookstore.com     | admin123  |
| User  | john@example.com        | user123   |
| User  | jane@example.com        | user123   |

---

## ✨ Features

### Public Features
- 🏠 Beautiful landing page with hero section
- 📚 Browse all books with search & filters
- 📖 Detailed book pages
- 🔐 Register, Login, Forgot Password

### User Features
- 🎯 Personalized dashboard
- 🔍 Search by title/author, filter by category, sort by price/rating
- 🛒 Shopping cart with quantity management
- ❤️ Wishlist functionality
- 📦 Checkout with shipping & payment
- 📋 Order history with tracking
- 🌙 Dark/Light mode

### Admin Features
- 📊 Analytics dashboard with charts
- 📈 Revenue charts & statistics
- 📚 Full CRUD for books
- 👥 User management (enable/disable accounts)
- 📦 Order management with status updates
- 🔔 Notifications & alerts

---

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login & get JWT
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password

### Books (Public)
- `GET /api/books` — Get paginated books (with search, filter, sort)
- `GET /api/books/{id}` — Get book by ID
- `GET /api/books/featured` — Get featured books
- `GET /api/books/new-arrivals` — Get newest books
- `GET /api/books/categories` — Get all categories

### User (Protected)
- `GET /api/user/profile` — Get current user profile
- `POST /api/user/orders` — Place new order
- `GET /api/user/orders` — Get my orders
- `GET /api/user/orders/{id}` — Get specific order

### Admin (Admin only)
- `GET /api/admin/dashboard` — Dashboard statistics
- `POST /api/admin/books` — Create book
- `PUT /api/admin/books/{id}` — Update book
- `DELETE /api/admin/books/{id}` — Soft delete book
- `GET /api/admin/users` — Get all users
- `PATCH /api/admin/users/{id}/toggle-status` — Toggle user status
- `GET /api/admin/orders` — Get all orders
- `PATCH /api/admin/orders/{id}/status` — Update order status

---

## 🎨 UI Highlights

- Professional blue/white/gray color palette
- Smooth animations and hover effects
- Loading skeletons for async content
- Toast notifications for all actions
- Dark mode with system preference detection
- Mobile-first responsive design
- Sticky navigation with scroll detection
- Card-based book layouts with quick actions

---

## 📄 License

MIT License — Free for educational and commercial use.

---

*Built as a professional final-year Java Full Stack project showcasing enterprise-grade development practices.*
