const { Book, Borrow } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Get all books
const getBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// Get a single book with its average score
const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Calculate average score
    const averageScore = await Borrow.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('userScore')), 'averageScore'],
      ],
      where: {
        BookId: id,
        userScore: { [Op.not]: null },
      },
      raw: true,
    });
    
    let score = -1; // Default if no scores
    if (averageScore.averageScore !== null) {
      score = parseFloat(averageScore.averageScore).toFixed(2);
    }
    
    res.status(200).json({
      id: book.id,
      name: book.name,
      score,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new book
const createBook = async (req, res, next) => {
  try {
    let bookData = req.body;
    const { name } = bookData;
    
    // Log detailed information about what we're trying to create
    console.log('Attempting to create book with name:', name);
    console.log('Request body after processing:', JSON.stringify(bookData));
    
    // Extra validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Book name must be a non-empty string' });
    }
    
    // Check if book already exists
    const existingBook = await Book.findOne({ where: { name } });
    if (existingBook) {
      console.log('Book already exists with id:', existingBook.id);
      return res.status(400).json();
    }
    
    await Book.create({ name });
    res.status(201).json();
  } catch (error) {
    console.error('Book creation error:', error.name, error.message);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors));
    }
    
    return res.status(500).json();
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
};