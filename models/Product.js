const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: {
    type: Number,
    min: 0 // ✅ negative price fix
  }
});

module.exports = mongoose.model('Product', productSchema);