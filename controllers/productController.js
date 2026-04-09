const Product = require('../models/Product');
const sanitize = require('mongo-sanitize');

exports.search = async (req, res) => {
  const query = sanitize(req.query.q); // ✅ injection safe

  const products = await Product.find({
    name: { $regex: query, $options: 'i' }
  });

  res.send(products);
};