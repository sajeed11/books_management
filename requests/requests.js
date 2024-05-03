import Joi from 'joi';


export function ByIdRequest() {
  return Joi.object({
    id: Joi.number().required()
  })
}

export function ByTwoIdRequest() {
  return Joi.object({
    id: Joi.number().required(),
    author_id: Joi.number().required()
  })
}

export function createBookRequestSchema() {
  return Joi.object({
    title: Joi.string().required(),
    author_id: Joi.number().required(),
    isbn: Joi.string().required(),
    publication_date: Joi.date().required(),
    genre_id: Joi.number().required(),
    price: Joi.number().required(),
    stock_quantity: Joi.number().required(),
    author_request_status: Joi.string().required(),
    picture: Joi.string().required()
  })
}

export function approveBookRequestSchema() {
  return Joi.object({
    id: Joi.number().required()
  })
}

export function updateBookRequestSchema() {
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

export function searchBookRequestSchema() {
  return Joi.object({
    title: Joi.string(),
    author_name: Joi.number(),
    isbn: Joi.string(),
    publication_date: Joi.date(),
    genre_name: Joi.number(),
    price: Joi.number(),
  })
}

export function ApprovingRequestID() {
  return Joi.object({
    id: Joi.number().required()
  })
}

export function ApprovingRequestData() {
  return Joi.object({
    id: Joi.number().required(),
    book_id: Joi.number().required(),
    status: Joi.string().valid('approved', 'rejected').required()
  })
}