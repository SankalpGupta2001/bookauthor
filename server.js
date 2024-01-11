const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config(); 

app.use(express.json());

const connectDB = require('./config/db');
connectDB(); 

const authorsRoutes = require('./routes/AuthorRoutes');
const booksRoutes = require('./routes/BooksRoutes');
const authornewRoutes = require('./routes/AuthornewRoutes');
const booksnewRoutes = require('./routes/BooksnewRoutes');


app.use('/api/authors', authorsRoutes);
app.use('/api/books', booksRoutes);
app.use('/authors', authornewRoutes);
app.use('/books', booksnewRoutes);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
