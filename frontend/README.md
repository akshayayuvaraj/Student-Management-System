# 🎓 Student Management System (MERN Stack)

A complete, production-ready **Student Management System** built with MongoDB, Express.js, React.js (Vite), and Node.js. Features JWT authentication, a full CRUD student module, dashboard statistics, search & filtering, and a modern glassmorphism UI.

---

## ✨ Features

- **Authentication**: Register, login, JWT-based sessions, bcrypt password hashing, protected routes, logout
- **Student CRUD**: Add, view, update, delete student records
- **Dashboard**: Live stats (total students, department count, final-year students), search by name/roll number, filter by department
- **Modern UI**: Gradient animated login page, glassmorphism card, responsive navbar, mobile-friendly table, hover effects, loading spinners, inline error handling

---

## 🧱 Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Frontend   | React.js, Vite, React Router DOM, Axios, CSS |
| Backend    | Node.js, Express.js                          |
| Database   | MongoDB + Mongoose                           |
| Auth       | JWT (jsonwebtoken) + bcryptjs                |

---

## 📁 Folder Structure

```
student-management-system/
├── client/                      # React frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StudentForm.jsx
│   │   │   ├── StudentTable.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register / Login / Me
│   │   └── studentController.js # Student CRUD + stats
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

**Why this structure?** The backend follows the **MVC (Model-View-Controller)** pattern: `models/` define the MongoDB schemas, `controllers/` hold business logic, and `routes/` map HTTP endpoints to controllers. The frontend separates **components** (reusable UI pieces), **pages** (route-level views), and **services** (API communication layer), which keeps concerns isolated and the codebase easy to scale.

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ and npm
- [MongoDB](https://www.mongodb.com/) — either installed locally or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Clone and install dependencies

```bash
# Backend
cd server
npm install

# Frontend (in a new terminal)
cd client
npm install
```

### 2. Configure environment variables

**server/.env** (copy from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_management
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

**client/.env** (copy from `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. MongoDB Setup

**Option A — Local MongoDB**
1. Install MongoDB Community Edition from the [official site](https://www.mongodb.com/try/download/community).
2. Start the MongoDB service:
   - macOS/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`
   - Windows: MongoDB runs as a service automatically after install, or run `mongod` manually.
3. Use `MONGO_URI=mongodb://127.0.0.1:27017/student_management` in `server/.env`.

**Option B — MongoDB Atlas (cloud, recommended for deployment)**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user (Database Access) and allow your IP (Network Access → Add IP, or `0.0.0.0/0` for testing).
3. Click **Connect → Drivers**, copy the connection string, and replace `<username>`, `<password>`, and add `/student_management` before the query params.
4. Paste it into `server/.env` as `MONGO_URI`.

### 4. Run the application

```bash
# Terminal 1 - start backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 - start frontend (http://localhost:5173)
cd client
npm run dev
```

Open `http://localhost:5173` in your browser. Register a new account, then log in to access the dashboard.

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint          | Access  | Description                          |
|--------|-------------------|---------|--------------------------------------|
| POST   | `/register`       | Public  | Register a new user (name, email, password) |
| POST   | `/login`          | Public  | Login and receive a JWT token        |
| GET    | `/me`             | Private | Get the logged-in user's profile     |

### Student Routes — `/api/students` (all require `Authorization: Bearer <token>`)

| Method | Endpoint             | Description                                          |
|--------|----------------------|-------------------------------------------------------|
| GET    | `/`                  | Get all students. Supports `?search=` (name/roll) and `?department=` query params |
| POST   | `/`                  | Create a new student                                  |
| GET    | `/:id`               | Get a single student by ID                            |
| PUT    | `/:id`               | Update a student by ID                                |
| DELETE | `/:id`               | Delete a student by ID                                |
| GET    | `/stats/summary`     | Get dashboard stats: total students, department count, final-year count |

### Example: Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@college.edu",
  "password": "securePass123"
}
```

### Example: Create Student
```http
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Priya Sharma",
  "rollNumber": "CS2023045",
  "department": "Computer Science",
  "year": 3,
  "email": "priya.sharma@college.edu"
}
```

### Standard Response Codes
- `200 OK` — Successful GET/PUT/DELETE
- `201 Created` — Successful POST (resource created)
- `400 Bad Request` — Validation error / missing fields
- `401 Unauthorized` — Missing/invalid/expired token, or bad credentials
- `404 Not Found` — Resource or route doesn't exist
- `409 Conflict` — Duplicate email/roll number
- `500 Internal Server Error` — Unexpected server error

---

## 🖥️ Student Fields

| Field       | Type   | Notes                          |
|-------------|--------|---------------------------------|
| name        | String | Required                        |
| rollNumber  | String | Required, unique                |
| department  | String | Required                        |
| year        | Number | Required, 1–4                   |
| email       | String | Required, unique, validated     |

---

## 🚀 Building for Production

```bash
# Build the frontend
cd client
npm run build   # outputs to client/dist

# Serve the backend
cd server
npm start
```

Deploy the backend to a Node host (Render, Railway, Fly.io) and the frontend to a static host (Vercel, Netlify), pointing `VITE_API_BASE_URL` at your deployed API URL.

---

## 📄 License

This project is open-sourced for educational purposes (academic/final-year projects, portfolios). Feel free to use and modify it.