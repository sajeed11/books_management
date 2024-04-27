import BookModel from '../models/Book.js'
import BookRequest from '../requests/requestBook.js'

class BookController {

  static async index(req, res) {

    var result = await BookModel.index()

    if (result) {
      if (result.length > 0) {
        res.status(200).json(
          {
            success: true,
            message: 'Books retrieved successfully',
            data: result
          }
        )
      } else {
        res.status(404).json(
          {
            success: false,
            message: 'No books found'
          }
        )
      }
    } else {
      res.status(400).json(
        {
          success: false,
          message: 'Failed to retrieve books'
        }
      )
    }
  }

  static async getAllBooks(req, res) {

    var result = await BookModel.getAllBooks()

    if (result) {
      if (result.length > 0) {
        res.status(200).json(
          {
            success: true,
            message: 'Books retrieved successfully',
            data: result
          }
        )
      } else {
        res.status(404).json(
          {
            success: false,
            message: 'No books found'
          }
        )
      }
    } else {
      res.status(400).json(
        {
          success: false,
          message: 'Failed to retrieve books'
        }
      )
    }
  }

  static async getBookById(req, res) {
    // Validate the id
    const bookRequest = new BookRequest();
    const { error } = bookRequest.getBookByIdRequestSchema().validate(req.params);

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

    var id = req.params.id

    var result = await BookModel.getBookById(id)

    if (result) {
      if (result.length > 0) {
        res.status(200).json(
          {
            success: true,
            message: 'Book retrieved successfully',
            data: result
          }
        )
      } else {
        res.status(404).json(
          {
            success: false,
            message: 'Book not found'
          }
        )
      }
    } else {
      res.status(400).json(
        {
          success: false,
          message: 'Failed to retrieve book'
        }
      )
    }
  }

  // Create a new book
  static async createBook(req, res) {
    // Validate the request body
    const bookRequest = new BookRequest();
    const { error } = bookRequest.createBookRequestSchema().validate(req.body);

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

    var result = await BookModel.createBook(data)

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
  static async approveBook(req, res) {
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
    var book = await BookModel.getBookById(id)

    if (book) {
      if (book.length > 0) {
        if (book[0].author_request_status === 'pending') {
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
        res.status(404).json(
          {
            success: false,
            message: 'Book not found'
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

export default BookController;