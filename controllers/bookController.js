import autoBind from 'auto-bind'
import BookModel from '../models/Book.js'
import BaseController from './baseController.js'
import { createBookRequestSchema } from '../requests/requestBook.js'

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
      return res.status(400).json(
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
      res.status(201).json(
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
    // Validate the id
    if (!req.params.id) {
      res.status(400).json(
        {
          success: false,
          message: 'Please provide a book id'
        }
      )
      return
    }

    var id = req.params.id

    // We check if the book exists then if it not approved yet
    var book = await bookModel.readById(id)

    if (book) {
      if (book.author_request_status === 'pending') {
        var result = await BookModel.approveBook(id)

        if (result) {
          res.status(200).json(
            {
              success: true,
              message: 'Book approved successfully'
            }
          )
        } else {
          res.status(400).json(
            {
              success: false,
              message: 'Failed to approve book'
            }
          )
        }
      } else {
        res.status(400).json(
          {
            success: false,
            message: 'Book already approved'
          }
        )
      }
    } else {
      res.status(400).json(
        {
          success: false,
          message: 'Failed to approve book'
        }
      )
    }
  }
}

const bookModel = new BookModel('books')

export default new BookController(bookModel)