# 🚀 TaskFlow Backend

**TaskFlow** is a powerful backend for a task management system built using **Node.js**, **Express**, and **MongoDB**. It supports full **authentication**, **task CRUD operations**, and **admin functionalities** like role toggling and user activity logs.

---

## 📌 Features

- ✅ User registration, login, logout, and token refreshing (JWT-based)
- 📋 Task management (create, update, delete, filter, search)
- 🔐 Role-based access: User & Admin
- 🛠 Admin dashboard with:
  - View all users
  - Toggle user roles
  - View/Delete user login/logout logs
- 🔒 Security:
  - Bcrypt for password hashing
  - JWT-based authentication
  - Middleware for protected/admin routes

---

## ⚙️ Tech Stack

| Tech        | Purpose                     |
|-------------|-----------------------------|
| Node.js     | Runtime                     |
| Express.js  | Web framework               |
| MongoDB     | NoSQL database              |
| Mongoose    | MongoDB ODM                 |
| bcryptjs    | Password hashing            |
| jsonwebtoken| JWT auth                    |
| dotenv      | Environment config          |
| cors        | Cross-Origin Resource Sharing|



---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-flow.git
cd task-flow/server


