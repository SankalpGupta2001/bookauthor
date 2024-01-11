const express = require('express');
const router = express.Router();
const Book = require('../models/BooksModels');
const authenticateUser = require('../middleware/authenticateUser');

// Get all books 
router.get('/', authenticateUser, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/:id', authenticateUser, async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a book (accessible to logged-in users)
router.post('/', authenticateUser, async (req, res) => {
    const { title } = req.body;
    const authorId = req.authorId; // Assuming `authorId` is set in the authenticateUser middleware
    
    try {
      const book = new Book({ title, author: authorId });
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
  


router.put('/:id', authenticateUser, async (req, res) => {
  const bookId = req.params.id;
  const { title  } =req.body;
  const authorId = req.authorId; // Assuming `authorId` is set in the authenticateUser middleware

  try {
    const book = await Book.findByIdAndUpdate(bookId, { title, author:authorId }, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


router.delete('/:id', authenticateUser, async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
