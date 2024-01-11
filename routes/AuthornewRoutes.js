const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Author = require('../models/AuthorModels');
const Book = require('../models/BooksModels');
const authenticateUser = require('../middleware/authenticateUser');

// Assuming you have models for Author and Book and they are imported

router.get('/', authenticateUser, async (req, res) => {
    try {
      const authors = await Author.aggregate([
        {
          $lookup: {
            from: 'books', // Name of the books collection in MongoDB
            localField: '_id',
            foreignField: 'author',
            as: 'books'
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            phone_no: 1,
            bookCount: { $size: '$books' } // Count the number of books for each author
          }
        }
      ]);
  
      res.json(authors);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });

  router.get('/:id', authenticateUser ,async (req, res) => {
    const authorId = req.params.id;
  
    try {
      // Find author by ID
      const author = await Author.findById(authorId);
  
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
  
      // Find books by author ID
      const books = await Book.find({ author: authorId });
  
      // Construct the response object
      const response = {
        _id: author._id,
        name: author.name,
        email: author.email,
        phone_no: author.phone_no,
        books: books.map(book => ({
          id: book._id,
          title: book.title
        }))
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  router.get('/loggedin/me', authenticateUser, async (req, res) => {
    const authorId = req.authorId; // Assuming `authorId` is set in the authenticateUser middleware
    
    try {
      // Find author by ID
      const author = await Author.findById(authorId);
  
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
  
      // Find books by author ID
      const books = await Book.find({ author: authorId });
  
      // Construct the response object
      const response = {
        _id: author._id,
        name: author.name,
        email: author.email,
        phone_no: author.phone_no,
        books: books.map(book => ({
          id: book._id,
          title: book.title
       }))
      };
  
      res.json(response);
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).json({ message: 'Server Error' });
    }
  });

module.exports = router;
