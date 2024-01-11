const jwt = require('jsonwebtoken');
const Author = require('../models/AuthorModels');

const authenticateUser = async (req, res, next) => {
  try {
    // Extract token from headers or query parameters
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token || '';

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: Token not provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const author = await Author.findOne({ _id: decoded.authorId });

    if (!author) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    // Attach user information to the request object for further use
    req.authorId = author._id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

module.exports = authenticateUser;
