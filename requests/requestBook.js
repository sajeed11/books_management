import Joi from "joi";

class BookRequest {
  getBookByIdRequestSchema() {
    return Joi.object({
      id: Joi.number().required()
    })
  }

  createBookRequestSchema() {
    return Joi.object({
      title: Joi.string().required(),
      author_id: Joi.number().required(),
      isbn: Joi.string().required(),
      publication_date: Joi.date().required(),
      genre_id: Joi.number().required(),
      price: Joi.number().required(),
      stock_quantity: Joi.number().required(),
      author_request_status: Joi.string().valid('none', 'pending').required().default('pending')
    })
  }
}

export default BookRequest;