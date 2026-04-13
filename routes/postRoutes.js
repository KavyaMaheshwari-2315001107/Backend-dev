const express = require('express');
const router = express.Router();

const { createPost, getPosts } = require('../controllers/postController');
const auth = require('../middleware/auth');
const sanitize = require('../middleware/sanitize');

router.post('/create', auth, sanitize, createPost);
router.get('/', getPosts);

module.exports = router;