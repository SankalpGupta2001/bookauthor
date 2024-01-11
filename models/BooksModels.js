const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true }
});

const Book = mongoose.model('books', bookSchema);

module.exports = Book;
