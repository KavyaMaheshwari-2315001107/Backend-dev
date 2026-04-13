require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo') // ✅ correct
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const app = express()

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

// ================= MIDDLEWARE =================
app.use(express.json())

app.use(helmet())

app.use(cors({
  origin: "*"
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

// ================= SESSION (FIXED) =================
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}))

// ================= ROUTE =================
app.get('/', (req, res) => {
  res.send("Server Running Securely 🚀")
})

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server started on port 3000")
})