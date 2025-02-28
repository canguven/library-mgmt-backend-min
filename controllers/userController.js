const { User, Book, Borrow } = require('../models');
const { Op } = require('sequelize');

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get a single user with their borrowing history
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get past borrowings (returned books)
    const pastBorrows = await Borrow.findAll({
      where: {
        UserId: id,
        returnedAt: { [Op.not]: null },
      },
      include: [
        {
          model: Book,
          attributes: ['name'],
        },
      ],
    });
    
    // Get current borrowings (not returned)
    const presentBorrows = await Borrow.findAll({
      where: {
        UserId: id,
        returnedAt: null,
      },
      include: [
        {
          model: Book,
          attributes: ['name'],
        },
      ],
    });
    
    // Format the response
    const pastBooks = pastBorrows.map(borrow => ({
      name: borrow.Book.name,
      userScore: borrow.userScore,
    }));
    
    const presentBooks = presentBorrows.map(borrow => ({
      name: borrow.Book.name,
    }));
    
    res.status(200).json({
      id: user.id,
      name: user.name,
      books: {
        past: pastBooks,
        present: presentBooks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new user
const createUser = async (req, res, next) => {
  try {
    let userData = req.body;
    const { name } = userData;
    
    // Log detailed information
    console.log('Attempting to create user with name:', name);
    console.log('Request body after processing:', JSON.stringify(userData));
    
    // Extra validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'User name must be a non-empty string' });
    }
    
    // Check if user already exists by name (for testing purposes)
    const existingUser = await User.findOne({ where: { name } });
    if (existingUser) {
      console.log('User already exists with id:', existingUser.id);
      return res.status(400).json();
    }
    
    await User.create({ name });
    res.status(201).json();
  } catch (error) {
    console.error('User creation error:', error.name, error.message);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors));
    }
    
    return res.status(500).json();
  }
};

// Borrow a book
const borrowBook = async (req, res, next) => {
  try {
    const { userId, bookId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if the book is already borrowed
    const existingBorrow = await Borrow.findOne({
      where: {
        BookId: bookId,
        returnedAt: null,
      },
    });
    
    if (existingBorrow) {
      return res.status(400).json({ message: 'Book is already borrowed' });
    }
    
    // Create a new borrow record
    await Borrow.create({
      UserId: userId,
      BookId: bookId,
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Return a book with rating
const returnBook = async (req, res, next) => {
  try {
    const { userId, bookId } = req.params;
    
    let returnData = req.body;
    
    // Handle Postman format directly here as a backup
    if (returnData.mode === 'raw' && returnData.raw) {
      try {
        returnData = JSON.parse(returnData.raw);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON in request body' });
      }
    }
    
    const { score } = returnData;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Find the borrow record
    const borrow = await Borrow.findOne({
      where: {
        UserId: userId,
        BookId: bookId,
        returnedAt: null,
      },
    });
    
    if (!borrow) {
      return res.status(400).json({ message: 'Book is not borrowed by this user' });
    }
    
    // Update the borrow record
    borrow.returnedAt = new Date();
    borrow.userScore = score;
    await borrow.save();
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  borrowBook,
  returnBook,
};