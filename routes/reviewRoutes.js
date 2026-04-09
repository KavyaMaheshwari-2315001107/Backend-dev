const router = require('express').Router();
const { addReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/add', auth, addReview);

module.exports = router;