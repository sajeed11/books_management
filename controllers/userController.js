import BookModel from '../models/Book.js';

class UserController {

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
}

export default UserController;