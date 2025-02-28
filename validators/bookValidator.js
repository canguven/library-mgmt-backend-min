const Joi = require('joi');

const createBookSchema = Joi.object({
  name: Joi.string().required(),
});

const returnBookSchema = Joi.object({
  score: Joi.number().integer().min(0).max(10).required(),
});

module.exports = {
  createBookSchema,
  returnBookSchema,
};