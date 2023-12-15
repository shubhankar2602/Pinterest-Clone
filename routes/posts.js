const mongoose = require('mongoose');

// Define Post Schema
const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
  },
  image:{
    type: String
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

// Create Post model
module.exports = mongoose.model('Post', postSchema);


