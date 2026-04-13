const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');
const sanitize = require('../middleware/sanitize');

router.post('/register', sanitize, validate, register);
router.post('/login', login);

module.exports = router;