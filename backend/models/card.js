const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // Card name
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // Card link
  link: {
    type: String,
    required: true,
  },
  // Card owner
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // Card likes
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  // Card creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
