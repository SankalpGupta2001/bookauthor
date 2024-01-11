const express = require('express');
const router = express.Router();
const Book = require('../models/BooksModels');
const authenticateUser = require('../middleware/authenticateUser');

router.get('/', authenticateUser , async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortByLikes = req.query.sortByLikes || 'descending'; // 'ascending' or 'descending'

    let sortOrder = 1;
    if (sortByLikes === 'descending') {
      sortOrder = -1;
    }

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    const books = await Book.find({})
      .sort({ likes: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      
    res.json({
      totalBooks,
      totalPages,
      currentPage: page,
      books
    });

  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: 'Server Error' });
  }
});


router.put('/like/:id', authenticateUser, async (req, res) => {
    const bookId = req.params.id;
    const authorId = req.authorId; // Assuming `authorId` is set in the authenticateUser middleware
    
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      if (book.likes.includes(authorId)) {
        return res.status(400).json({ message: 'Book already liked by this user' });
      }
  
      book.likes.push(authorId);
      await book.save();
      res.json({ message: 'Book liked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // Unlike a book (accessible to logged-in users)
  router.put('/unlike/:id', authenticateUser, async (req, res) => {
    const bookId = req.params.id;
    const authorId = req.authorId; // Assuming `authorId` is set in the authenticateUser middleware
    
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      const index = book.likes.indexOf(authorId);
      if (index === -1) {
        return res.status(400).json({ message: 'Book not liked yet by this user' });
      }
  
      book.likes.splice(index, 1);
      await book.save();
      res.json({ message: 'Book unliked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

module.exports = router;
