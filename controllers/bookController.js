import httpStatus from "http-status"; // For standardized HTTP status codes
import autoBind from 'auto-bind'
import BookModel from '../models/Book.js'
import BaseController from './baseController.js'
import { createBookRequestSchema, approveBookRequestSchema, updateBookRequestSchema } from '../requests/requestBook.js'
import { ByIdRequest } from "../requests/requestBase.js";
import AuthorRequestModel from "../models/AuthorRequest.js";

const authorRequestModel = new AuthorRequestModel('author_requests')

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

    try {
      var result = await bookModel.create(data)
      console.log(result)

      if (result) {
        try {

          await authorRequestModel.create(
            {
              book_id: result,
              author_id: req.body.author_id,
              request_type: 'create',
              status: 'pending',
            }
          )

          return res.status(httpStatus.CREATED)
            .json(
              {
                success: true,
                message: 'Book created successfully, waiting for approval',
                data: data
              }
            )
        } catch (error) {
          // console.log(error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(
              {
                success: false,
                error: {
                  message: 'Internal server error'
                }
              }
            )
        }
      }
    } catch (error) {
      // console.log(error)
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(httpStatus.BAD_REQUEST)
          .json(
            {
              success: false,
              error: {
                message: 'Book already exists'
              }
            }
          )
      } else {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json(
            {
              success: false,
              error: {
                message: 'Internal server error'
              }
            }
          )
      }
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

      if (!book[0]) {
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
          error: {
            message: error.message
          }
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
            error: {
              message: 'Internal server error'
            }
          }
        )
    }
  }

  async updateBook(req, res) {
    // Validate the request
    const { error } = updateBookRequestSchema().validate(req.body)
    const { error: idError } = ByIdRequest().validate(req.params)

    if (error || idError) {
      return res.status(httpStatus.BAD_REQUEST)
        .json(
          {
            success: false,
            error: {
              message: error ? error.details[0].message : idError.details[0].message,
              type: error ? error.details[0].type : idError.details[0].type,
              context: error ? error.details[0].context : idError.details[0].context
            }
          }
        )
    }

    const id = req.params.id
    const data = req.body

    // We check if the book exists then if it not approved yet
    try {
      var book = await bookModel.readById(req.params.id)

      if (!book[0]) {
        return res.status(httpStatus.NOT_FOUND)
          .json(
            {
              success: false,
              error: {
                message: 'Book not found'
              }
            }
          )
      }
    } catch (error) {
      console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          error: {
            message: error.message
          }
        })
    }

    // We set the author_request_status to pending automatically
    data.author_request_status = 'pending'

    try {
      var result = await bookModel.update(id, data)
      console.log(result)

      if (result) {
        res.status(httpStatus.OK)
          .json(
            {
              success: true,
              message: 'Book updated successfully'
            }
          )
      }
    } catch (error) {
      console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          {
            success: false,
            error: {
              message: 'Internal server error'
            }
          }
        )
    }
  }

}

const bookModel = new BookModel('books')

export default new BookController(bookModel)