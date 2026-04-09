require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const sanitize = require('./middleware/sanitize');

const app = express();


// body parser
app.use(express.json());

app.use(sanitize);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https://cdn.example.com"],
        scriptSrc: ["'self'", "https://www.youtube.com"],
      },
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
});
app.use(limiter);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected "))
  .catch((err) => console.log(err));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),

    cookie: {
      maxAge: 1000 * 60 * 30, // 30 min
    },
  })
);


app.use('/auth', require('./routes/authRoutes'));
app.use('/product', require('./routes/productRoutes'));
app.use('/review', require('./routes/reviewRoutes'));


app.get('/', (req, res) => {
  res.send("Server running ");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} `);
});