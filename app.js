const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // form data
app.use(cookieParser());

const SALT_ROUNDS = 10;
const ACCESS_SECRET = "access-secret-123";
const REFRESH_SECRET = "refresh-secret-123";

const users = [];
const refreshTokens = new Set();

app.get('/', (req, res) => {
  res.send("<h2>Server is running</h2><a href='/register'>Go to Register</a>");
});

app.get('/register', (req, res) => {
  res.send(`
    <h2>Register User</h2>
    <form method="POST" action="/register">
      <input name="username" placeholder="Username" required /><br/><br/>
      <input name="email" placeholder="Email" required /><br/><br/>
      <input name="password" type="password" placeholder="Password" required /><br/><br/>
      <button type="submit">Register</button>
    </form>
  `);
});

function validatePassword(password) {
  const errors = [];

  if (password.length < 8) errors.push("Min 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Uppercase required");
  if (!/[a-z]/.test(password)) errors.push("Lowercase required");
  if (!/\d/.test(password)) errors.push("Number required");
  if (!/[!@#$%^&*]/.test(password)) errors.push("Special char required");

  console.log("Checking password breach database...");

  return { isValid: errors.length === 0, errors };
}

app.use(session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 60000
  }
}));

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();

  console.log("Unauthorized access attempt");
  return res.status(401).send("Login required");
}

function requireRole(role) {
  return (req, res, next) => {
    const user = users.find(u => u.id === req.session.userId);

    if (!user) return res.status(401).send("Unauthorized");

    if (user.role !== role) {
      console.log("Authorization failed");
      return res.status(403).send("Forbidden");
    }

    next();
  };
}

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).send("All fields required");

  const valid = validatePassword(password);
  if (!valid.isValid)
    return res.status(400).send(valid.errors.join(", "));

  if (users.find(u => u.email === email))
    return res.status(409).send("User already exists");

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = {
    id: users.length + 1,
    username,
    email,
    password: hashed,
    role: "user"
  };

  users.push(user);

  res.send("Registered successfully");
});

app.get('/login', (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input name="email" placeholder="Email" required /><br/><br/>
      <input name="password" type="password" placeholder="Password" required /><br/><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).send("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send("Invalid credentials");

  req.session.regenerate((err) => {
    if (err) return res.status(500).send("Session error");

    req.session.userId = user.id;

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    refreshTokens.add(refreshToken);

    res.cookie('token', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.send("Login successful <br><a href='/dashboard'>Go to Dashboard</a>");
  });
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send("Welcome User ");
});


app.get('/admin', isAuthenticated, requireRole('admin'), (req, res) => {
  res.send("Admin Panel");
});

app.listen(3000, () => console.log("Server running on port 3000"));
