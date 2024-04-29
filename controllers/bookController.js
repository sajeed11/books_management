import httpStatus from "http-status"; // For standardized HTTP status codes
import autoBind from 'auto-bind'
import BookModel from '../models/Book.js'
import BaseController from './baseController.js'
import { createBookRequestSchema, approveBookRequestSchema } from '../requests/requestBook.js'

class BookController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }

  // Create a new book
  async createBook(req, res) {
    // Validate the request body
    const { error } = createBookRequestSchema().validate(req.body)

    if (error) {
      return res.status(httpStatus.BAD_REQUEST)
        .json(
          {
            success: false,
            error: {
              message: error.details[0].message,
              type: error.details[0].type,
              context: error.details[0].context
            }
          }
        )
    }

    const data = req.body

    // We set the author_request_status to pending automatically
    data.author_request_status = 'pending'

    var result = await bookModel.create(data)
    console.log(result)

    if (result) {
      res.status(httpStatus.CREATED)
        .json(
          {
            success: true,
            message: 'Book created successfully',
            data: data
          }
        )
    }
  }

  // Approve a book
  async approveBook(req, res) {
    // Validate the request
    const { error } = approveBookRequestSchema().validate(req.params)

    if (error) {
      return res.status(httpStatus.BAD_REQUEST)
        .json(
          {
            success: false,
            error: {
              message: error.details[0].message,
              type: error.details[0].type,
              context: error.details[0].context
            }
          }
        )
    }

    // We check if the book exists then if it not approved yet
    try {
      var book = await bookModel.readById(req.params.id)

      if (!book) {
        return res.status(httpStatus.NOT_FOUND)
          .json(
            {
              success: false,
              message: 'Book not found'
            }
          )
      }

      if (book[0].author_request_status === 'none') {
        return res.status(httpStatus.BAD_REQUEST)
          .json(
            {
              success: false,
              message: 'Book already approved'
            }
          )
      }
    } catch (error) {
      console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: 'Internal server error'
        })
    }

    try {
      var result = await bookModel.update(req.params.id, { author_request_status: 'none' })

      if (result) {
        res.status(httpStatus.OK)
          .json(
            {
              success: true,
              message: 'Book approved successfully'
            }
          )
      }
    } catch (error) {
      console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          {
            success: false,
            message: 'Internal server error'
          }
        )
    }
  }
}

const bookModel = new BookModel('books')

export default new BookController(bookModel)