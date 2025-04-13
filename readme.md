# 🔐 RBAC-MERN Auth System

Role-Based Access Control (RBAC) API using **MERN stack**, **JWT**, **Passport.js**, and **Cookie-based Auth**.

---

## 🚀 Features

- User Registration & Login (JWT + HTTP-only cookies)
- Role-based access control middleware
- Passport JWT strategy integration
- Modular code (routes, controllers, middleware)

---

## 🧱 Tech Stack

| Layer     | Tech                   |
|-----------|------------------------|
| Backend   | Node.js, Express       |
| Database  | MongoDB + Mongoose     |
| Auth      | Passport.js + JWT      |
| Security  | Cookies, dotenv, bcrypt|

---

## 📁 Project Structure

```bash
RBAC-MERN/
├── config/              # DB + passport strategy
│   ├── db.js
│   └── passportConfig.js
├── controllers/         # Auth logic
│   └── authController.js
├── models/              # Mongoose schema
│   └── User.js
├── routes/              # Express routes
│   └── authRoutes.js
├── middleware.js        # Role check middleware
├── server.js            # Entry point
├── .env
└── package.json
```

---

## ⚙️ Setup Instructions

```bash
# Clone repo & install dependencies
git clone https://github.com/rishabh3562/RBAC-MERN.git
cd rbac-mern
npm install

# Add .env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret

# Run the server
npm start
```

---

## 🔑 API Endpoints

| Method | Route                 | Access        | Description            |
|--------|----------------------|---------------|------------------------|
| POST   | `/api/auth/register` | Public        | Register new user      |
| POST   | `/api/auth/login`    | Public        | Login user & set token |
| POST   | `/api/auth/logout`   | Authenticated | Logout (clear cookie)  |
| GET    | `/api/auth/admin`    | Admin Only    | Protected route        |

---

## 🔒 Role Middleware

```js
// middleware.js
export const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
```

---

## 🔐 Passport Strategy (JWT + Cookies)

- Extracts token from HTTP-only cookie
- Verifies with JWT secret
- Attaches `user` to `req` if valid

```js
jwtFromRequest: ExtractJwt.fromExtractors([
  (req) => req?.cookies?.token,
])
```

