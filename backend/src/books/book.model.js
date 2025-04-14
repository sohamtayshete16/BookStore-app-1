const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  author: {
    type: String,
    required: true,
    index: true
  },
  trending: {
    type: Boolean,
    required: true,
    default: false
  },
  coverImage: {
    type: String,
    required: true,
  },
  oldPrice: {
    type: Number,
    required: true,
  },
  newPrice: {
    type: Number,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// Compound index for better search performance
bookSchema.index({
  title: 'text',
  description: 'text',
  author: 'text'
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;