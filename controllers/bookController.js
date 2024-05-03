import httpStatus from "http-status"; // For standardized HTTP status codes
import autoBind from 'auto-bind'
import BookModel from '../models/Book.js'
import BaseController from './baseController.js'
import { createBookRequestSchema, approveBookRequestSchema, updateBookRequestSchema } from '../requests/requests.js'
import { ByIdRequest, ByTwoIdRequest } from "../requests/requests.js";
import AuthorRequestModel from "../models/AuthorRequest.js";

const authorRequestModel = new AuthorRequestModel('author_requests')

class BookController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }

  // Create a new book
  async createBook(req, res) {

    const data = {
      title: req.body.title,
      author_id: req.body.author_id,
      isbn: req.body.isbn,
      author_request_status: 'pending',
      picture: req.file ? req.file.filename : null,
      stock_quantity: req.body.stock_quantity,
      price: req.body.price,
      genre_id: req.body.genre_id,
      publication_date: req.body.publication_date,
    }

    // Validate the request body
    const { error } = createBookRequestSchema().validate(data)

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

    try {
      var result = await bookModel.create(data)

      if (result) {
        try {

          await authorRequestModel.create({
            book_id: result,
            author_id: req.body.author_id,
            request_type: 'create',
            status: 'pending',
          })

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

      // We check if the author is the owner of the book
      if (book[0].author_id !== req.body.author_id) {
        return res.status(httpStatus.FORBIDDEN)
          .json(
            {
              success: false,
              error: {
                message: 'You are not allowed to update this book'
              }
            }
          )
      }

    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR)
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
        try {

          await authorRequestModel.create({
            book_id: id,
            author_id: req.body.author_id,
            request_type: 'update',
            status: 'pending',
          })

          return res.status(httpStatus.OK)
            .json(
              {
                success: true,
                message: 'Book updated successfully'
              }
            )
        } catch (error) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(
              {
                success: false,
                error: {
                  message: error.message
                }
              }
            )
        }
      }
    } catch (error) {
      console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          {
            success: false,
            error: {
              message: error.message
            }
          }
        )
    }
  }

  async requestToDelete(req, res) {
    // Validate the request
    const { error } = ByIdRequest().validate(req.params)

    if (error || !req.query.author_id) {
      return res.status(httpStatus.BAD_REQUEST)
        .json({
          success: false,
          error: {
            message: error.details[0].message,
            type: error.details[0].type,
            context: error.details[0].context
          }
        })
    }

    const id = req.params.id
    const author_id = req.query.author_id
    console.log(id, author_id)

    // We check if the book exists then if it not approved yet
    try {
      var book = await bookModel.readById(id)

      if (!book[0]) {
        return res.status(httpStatus.NOT_FOUND)
          .json(
            {
              success: false,
              message: 'Book not found'
            }
          )
      }

      // We check if the author is the owner of the book
      if (book[0].author_id.toString() !== author_id) {
        return res.status(httpStatus.FORBIDDEN)
          .json(
            {
              success: false,
              message: 'You are not allowed to delete this book'
            }
          )
      }

    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          error: {
            message: error.message
          }
        })
    }

    const connection = await bookModel.getConnection()

    try {
      await connection.beginTransaction()

      try {
        await authorRequestModel.create({
          book_id: id,
          author_id: author_id,
          request_type: 'delete',
          status: 'pending',
        })

        await bookModel.update(id, { author_request_status: 'pending' })

        await connection.commit()
        return res.status(httpStatus.OK)
          .json(
            {
              success: true,
              message: 'Book delete request sent successfully'
            }
          )
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          {
            success: false,
            error: {
              message: error.message
            }
          }
        )
    }
  }
}

const bookModel = new BookModel('books')

export default new BookController(bookModel)