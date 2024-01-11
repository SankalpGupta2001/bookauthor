const { faker } = require('@faker-js/faker');
const Author = require('../models/AuthorModels'); // Import your Author model
const Book = require('../models/BooksModels'); // Import your Book model

// Generate Mock Data
const generateMockData = async () => {
  // Generate authors
  const authors = [];
  
    const author = new Author({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone_no: faker.string.numeric(10) 
    });
    await author.save();
    authors.push(author);
  

  // Generate books
  for (let i = 0; i < 5; i++) {
    
    const book = new Book({
    //   title: faker.word.adjective(Math.floor(Math.random() * 3) + 1),
    title: faker.lorem.words(Math.min(Math.floor(Math.random() * 3) + 1, 3)), // Limit to 3 words

      author: author._id,
    });
    await book.save();
  }
};

// Function to start the server
const startServer = async () => {
  // Generate mock data
  await generateMockData();
};

module.exports = startServer;
