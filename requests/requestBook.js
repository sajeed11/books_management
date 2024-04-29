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

export { createBookRequestSchema }