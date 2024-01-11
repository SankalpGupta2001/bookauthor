const mongoose = require('mongoose');
const startServer = require("../utils/StartServer");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    startServer();

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
