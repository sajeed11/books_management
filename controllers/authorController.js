import AuthorModel from "../models/Author.js";

class AuthorController {

  static async index(req, res) {

    var result = await AuthorModel.index()

    if (result) {
      if (result.length > 0) {
        res.status(200).json(
          {
            success: true,
            message: 'Authors retrieved successfully',
            data: result
          }
        )
      } else {
        res.status(404).json(
          {
            success: false,
            message: 'No authors found'
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

export default AuthorController;