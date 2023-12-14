const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/backendProjectDB");

// Define User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }],
  dp: {
    type: String, // You might want to store the path to the user's profile picture
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});


userSchema.plugin(plm);
// Create User model
module.exports = mongoose.model('User', userSchema);

