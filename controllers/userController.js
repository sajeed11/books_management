// Purpose: User controller to handle user related operations
import UserModel from "../models/User.js";
import UserRequest from "../requests/requestUser.js";
class UserController {

  static async index(req, res) {
    var result = await UserModel.index()

    if (result) {
      res.status(200).json({
        success: true,
        data: result
      })
    }
  }

  static async getUserById(req, res) {
    // Validate the request
    const userRequest = new UserRequest();
    const { error } = userRequest.getUserByIdRequestSchema().validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }

    var result = await UserModel.getUserById(req.params.id)

    if (result) {
      res.status(200).json({
        success: true,
        data: result
      })
    }
  }
}

export default UserController;