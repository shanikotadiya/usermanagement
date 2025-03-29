
// Please first set .env file with the following variables:
//file is located at backend/.env

// MONGO_URI = mongodb+srv://shanikotadiya:54MsIUKkJu5k0wfS@usermanagement.wjjugz9.mongodb.net/userdata?retryWrites=true&w=majority&appName=usermanagement
// JWT_SECRET = d6f5bf96abdf96d3bbf15660f1a3d74e87f9d7c29b6f44a1f745c0e96d92da6d8a4f49fa44c9b034db05072cd1c4c3f67
// BASE_URL=http://localhost:5000
// FRONTEND_URL=http://localhost:3000


//set this four variables in .env file in backend folder
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
