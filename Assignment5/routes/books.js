const express = require("express");
const validateYear = require("../middleware/validateYear");

const router = express.Router();

let books = [
  { id: 1, title: "Book One", author: "Author A", year: 2020 },
  { id: 2, title: "Book Two", author: "Author B", year: 2022 }
];

// GET all books (Filter + Pagination + Search)
router.get("/", (req, res) => {
  let { author, year, page = 1, limit = 10, search } = req.query;

  let filteredBooks = [...books];

  if (author) {
    filteredBooks = filteredBooks.filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );
  }

  if (year) {
    filteredBooks = filteredBooks.filter(
      book => book.year == year
    );
  }

  if (search) {
    filteredBooks = filteredBooks.filter(
      book => book.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  page = parseInt(page);
  limit = parseInt(limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  res.json(filteredBooks.slice(start, end));
});

// POST book (with validation middleware)
router.post("/", validateYear, (req, res) => {
  const newBook = {
    id: books.length + 1,
    ...req.body
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

module.exports = router;
