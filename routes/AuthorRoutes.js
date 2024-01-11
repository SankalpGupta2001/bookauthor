const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Author = require('../models/AuthorModels');
const authenticateUser = require('../middleware/authenticateUser');


// Login route
router.post('/login', async (req, res) => {
    const { email } = req.body;
  
    try {
      const author = await Author.findOne({ email });
      if (!author) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ authorId: author._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
// Get all authors
router.get('/', authenticateUser ,async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get an author by ID
router.get('/:id', authenticateUser ,async (req, res) => {
  const authorId = req.params.id;
  try {
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create an author
router.post('/', async (req, res) => {
  const { name, email, phone_no } = req.body;
  try {
    const author = new Author({ name, email, phone_no });
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update an author by ID
router.put('/:id', authenticateUser , async (req, res) => {
  const authorId = req.params.id;
  const { name, email, phone_no } = req.body;
  try {
    const author = await Author.findByIdAndUpdate(authorId, { name, email, phone_no }, { new: true });
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete an author by ID
router.delete('/:id', authenticateUser , async (req, res) => {
  const authorId = req.params.id;
  try {
    const author = await Author.findByIdAndDelete(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    
    await Book.deleteMany({ author: authorId });
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
