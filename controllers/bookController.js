import httpStatus from "http-status"; // For standardized HTTP status codes
import autoBind from 'auto-bind'
import BookModel from '../models/Book.js'
import BaseController from './baseController.js'
import { createBookRequestSchema, approveBookRequestSchema, updateBookRequestSchema } from '../requests/requests.js'
import { ByIdRequest } from "../requests/requests.js";
import AuthorRequestModel from "../models/AuthorRequest.js";
import { clientErrorResponse, notFoundResponse, serverErrorResponse } from "../helpers/handleErrorResponse.js";
import { okResponse } from "../helpers/handleOkResponse.js";

const authorRequestModel = new AuthorRequestModel('author_requests')

class BookController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }

  // Create a new book
  async createBook(req, res) {
    // Desctructure the request body
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

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

    try {
      let result = {}
      if (req.baseUrl.includes('/admin')) {
        result = await this.model.createBook(data, 'admin')
        // console.log(result)
      } else {
        result = await this.model.createBook(data)
        // console.log(result)
      }

      return res.status(httpStatus.CREATED).json(okResponse(result))
    } catch (error) {
      // console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  // Approve a book
  // async approveBook(req, res) {
  //   // Validate the request
  //   const { error } = approveBookRequestSchema().validate(req.params)

  //   if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

  //   // We check if the book exists then if it not approved yet
  //   try {
  //     var book = await bookModel.readById(req.params.id)

  //     if (!book) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())

  //     if (book.author_request_status === 'none')
  //       return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse('Book already approved'))
  //   } catch (error) {
  //     // console.log(error)
  //     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
  //   }

  //   try {
  //     var result = await bookModel.update(req.params.id, { author_request_status: 'none' })

  //     return res.status(httpStatus.OK).json(okResponse(result))
  //   } catch (error) {
  //     console.log(error)
  //     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
  //   }
  // }

  async updateBook(req, res) {
    const id = req.params.id
    const data = req.body
    data.author_request_status = 'pending'

    // Validate the request
    const { error } = updateBookRequestSchema().validate(req.body)
    const { error: idError } = ByIdRequest().validate(req.params)

    if (error)
      return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))
    else if (idError)
      return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(idError))

    // We check if the book exists then if it not approved yet
    try {
      var book = await bookModel.readById(req.params.id)

      if (!book) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())

      // We check if the author is the owner of the book
      if (book[0].author_id !== req.body.author_id)
        return res.status(httpStatus.FORBIDDEN).json(clientErrorResponse('You are not allowed to update this book'))

    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }

    try {
      const result = await bookModel.updateBook(id, data)

      return res.status(httpStatus.OK).json(okResponse(result))
    } catch (error) {
      // console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  async deleteBook(req, res) {
    const id = req.params.id
    const author_id = req.query.author_id

    // Validate the request
    const { error } = ByIdRequest().validate(req.params)

    if (error)
      return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))
    else if (!Number.isInteger(parseInt(author_id)))
      return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse('Author ID must be an integer'))

    // We check if the book exists then if it not approved yet
    try {
      var book = await bookModel.readById(id)

      if (!book[0]) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())

      // We check if the author is the owner of the book
      if (book[0].author_id.toString() !== author_id)
        return res.status(httpStatus.FORBIDDEN).json(clientErrorResponse('You are not allowed to delete this book'))

    } catch (error) {
      // console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }

    try {
      const result = await bookModel.deleteBook(id, author_id)

      return res.status(httpStatus.OK).json(okResponse(result))
    } catch (error) {
      // console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }
}

const bookModel = new BookModel('books')

export default new BookController(bookModel)