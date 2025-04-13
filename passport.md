# 🛂 Passport.js – Practical JWT Auth Guide (For MERN Devs)

> **Simple. Practical. Interview-friendly.**

---

## 📚 Table of Contents

1. [What is Passport.js](#-what-is-passportjs)
2. [JWT Strategy](#1️⃣-jwt-strategy)
3. [Local Strategy](#2️⃣-local-strategy)
4. [Google / OAuth Strategy](#3️⃣-google--oauth-strategy)
5. [Bearer Strategy](#4️⃣-bearer-strategy)
6. [Session Strategy](#5️⃣-session-strategy)
7. [Facebook / GitHub / Twitter Strategy](#6️⃣-facebook--github--twitter-strategy)
8. [Key Concepts Recap](#-remember-these-points)
9. [Strategy Comparison Table](#-comparison-table)
10. [Bonus Tips](#-bonus-tips)

---

## 🧩 What is Passport.js?

- Node.js **middleware for authentication**.
- Works with strategies: `JWT`, `Local`, `Google`, `GitHub`, etc.

---

## 1️⃣ JWT Strategy

> Best for APIs / SPAs (Stateless Auth)

### 🔧 Install
```bash
npm install passport passport-jwt jsonwebtoken
```

### 🔐 Flow

| Step | Description |
|------|-------------|
| 1️⃣ | User logs in → Server issues JWT |
| 2️⃣ | JWT sent via cookie/header |
| 3️⃣ | Passport verifies JWT |
| 4️⃣ | Adds `req.user` if valid |

### 🔥 Code
```js
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.cookies?.token,
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  const user = await User.findById(jwt_payload.id);
  return user ? done(null, user) : done(null, false);
}));
```

### 🔐 Protect Route
```js
router.get("/admin", 
  passport.authenticate("jwt", { session: false }), 
  checkRole(["admin"]), 
  getAdmin
);
```

---

## 2️⃣ Local Strategy

> For form-based login with username/password.

### 🔧 Install
```bash
npm install passport-local bcrypt
```

### 🔥 Code
```js
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) return done(null, false);
  return done(null, user);
}));
```

> After login, manually issue a JWT.

---

## 3️⃣ Google / OAuth Strategy

> For OAuth2 login (SSO).

### 🔧 Install
```bash
npm install passport-google-oauth20
```

### 🔥 Code
```js
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) user = await User.create({ googleId: profile.id, name: profile.displayName });
  done(null, user);
}));
```

---

## 4️⃣ Bearer Strategy

> Auth via `Authorization: Bearer <token>` header.

### 🔧 Install
```bash
npm install passport-http-bearer
```

### 🔥 Code
```js
passport.use(new BearerStrategy(async (token, done) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user ? done(null, user) : done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));
```

---

## 5️⃣ Session Strategy

> Session + cookie-based login (used with `passport-local`).

```bash
npm install express-session
```

### 🔥 Code
```js
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
```

---

## 6️⃣ Facebook / GitHub / Twitter Strategy

> Use for OAuth2 login with external providers.

### GitHub Example

#### 🔧 Install
```bash
npm install passport-github
```

#### 🔥 Code
```js
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: "/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ githubId: profile.id });
  if (!user) user = await User.create({ githubId: profile.id, name: profile.username });
  done(null, user);
}));
```

---

## 🧠 Remember These Points

| Concept              | Summary                             |
|----------------------|-------------------------------------|
| `passport.use()`     | Registers strategy                  |
| `passport.authenticate()` | Applies auth check              |
| `req.user`           | Set on successful auth              |
| JWT via Cookie/Header| Both supported                     |
| `session: false`     | Needed for token-only systems       |

---

## ✅ Comparison Table

| Strategy       | Use Case               | Flow              | State      |
|----------------|------------------------|-------------------|------------|
| **JWT**        | SPA / APIs             | Token (Cookie/Header) | Stateless  |
| **Local**      | Form login             | Username/Password | Stateless / Session |
| **Bearer**     | API Auth (Bearer token)| Header token      | Stateless  |
| **OAuth2**     | Google, GitHub, etc.   | Redirect-based    | Stateless / Session |
| **Session**    | Traditional web apps   | Cookie-based      | Stateful   |

---

## 🧠 Bonus Tips

- Use the right strategy name in `passport.authenticate()`.
- Combine strategies (e.g., Local + JWT).
- Prefer **stateless JWT** for scalable APIs.
- Use `secure` + `httpOnly` cookies in production.

.