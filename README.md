TaskFlow Backend
TaskFlow Backend is a Node.js/Express server for a task management application built with MongoDB. It handles user authentication, task CRUD operations, and admin functionalities like role toggling and user log management.
Features

Authentication: Register, login, logout, and token refresh with JWT.
Task Management: Create, read, update, and delete tasks with status filtering and title search.
Admin Dashboard: View user logs, toggle user roles (admin/user), and delete logs (admin-only).
Security: Password hashing with bcrypt, JWT-based authentication, and admin middleware.

Tech Stack

Node.js: Runtime environment.
Express.js: Web framework.
MongoDB: NoSQL database.
Mongoose: ODM for MongoDB.
jsonwebtoken: JWT for authentication.
bcryptjs: Password hashing.
dotenv: Environment variable management.
cors: Cross-origin resource sharing.

Prerequisites

Node.js (v16 or higher)
MongoDB (local or MongoDB Atlas)
npm (v8 or higher)

Project Structure
task-flow/server/
├── src/
│   ├── config/
│   │   └── env.js              # Environment variable exports
│   ├── controllers/
│   │   ├── task.controller.js   # Task CRUD operations
│   │   └── user.controller.js   # User auth and admin functions
│   ├── middleware/
│   │   └── auth.middleware.js   # Authentication and admin middleware
│   ├── models/
│   │   ├── task.model.js        # Task schema
│   │   ├── user.model.js        # User schema
│   │   └── userLog.model.js     # User log schema
│   ├── routes/
│   │   ├── task.routes.js       # Task API routes
│   │   └── user.routes.js       # User and auth API routes
│   └── index.js                 # Server entry point
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
└── README.md                    # This file

Setup Instructions

Clone the Repository:
git clone https://github.com/your-repo/task-flow.git
cd task-flow/server


Install Dependencies:
npm install


Configure Environment Variables:

Create a .env file in the root directory:MONGODB_URI=mongodb://localhost:27017/taskflow
PORT=8000
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret


Replace MONGODB_URI with your MongoDB connection string (local or Atlas).
Generate secure secrets for ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET.


Run the Server:
npm start


Server runs on http://localhost:8000.
MongoDB connection status is logged to the console.



API Endpoints
Authentication (/auth/v1)

POST /register: Register a new user (body: { username, email, password, role }).
POST /login: Login and get tokens (body: { email, password }).
POST /refresh: Refresh access token (body: { refreshToken }).
POST /logout: Logout and invalidate refresh token (body: { refreshToken }).

Tasks (/api/v1)

GET /tasks: Fetch tasks (query: ?status=completed&search=title).
POST /tasks: Create a task (body: { title, description, status }).
PUT /tasks/:taskId: Update a task (body: { title, description, status }).
DELETE /tasks/:taskId: Delete a task.

Admin (/auth/v1, admin-only)

GET /users: List all users.
PATCH /users/:userId/role: Toggle user role (admin/user).
GET /user-logs: Fetch user login/logout logs.
DELETE /user-logs/:logId: Delete a user log.

Testing

Use Postman:
Register a user (POST /auth/v1/register).
Login to get tokens (`POST /auth


