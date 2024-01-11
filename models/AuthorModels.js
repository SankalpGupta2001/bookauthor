const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_no: { type: String }
});

const Author = mongoose.model('author', authorSchema);

module.exports = Author;
