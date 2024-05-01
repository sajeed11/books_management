import Joi from "joi";

function createBookRequestSchema() {
  return Joi.object({
    title: Joi.string().required(),
    author_id: Joi.number().required(),
    isbn: Joi.string().required(),
    publication_date: Joi.date().required(),
    genre_id: Joi.number().required(),
    price: Joi.number().required(),
    stock_quantity: Joi.number().required(),
  })
}

function approveBookRequestSchema() {
  return Joi.object({
    id: Joi.number().required()
  })
}

function updateBookRequestSchema() {
  return Joi.object({
    title: Joi.string(),
    author_id: Joi.number().required(),
    isbn: Joi.string().required(),
    publication_date: Joi.date(),
    genre_id: Joi.number(),
    price: Joi.number(),
    stock_quantity: Joi.number(),
  })
}

export { createBookRequestSchema, approveBookRequestSchema, updateBookRequestSchema }