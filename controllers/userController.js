// Purpose: User controller to handle user related operations
import autoBind from 'auto-bind'
import UserModel from "../models/User.js";
import BaseController from '../controllers/baseController.js'
class UserController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }


  // static async getUserById(req, res) {
  //   // Validate the request
  //   const userRequest = new UserRequest();
  //   const { error } = userRequest.getUserByIdRequestSchema().validate(req.params);

  //   if (error) {
  //     return res.status(400).json({
  //       success: false,
  //       message: error.message
  //     })
  //   }

  //   var result = await UserModel.getUserById(req.params.id)

  //   if (result) {
  //     res.status(200).json({
  //       success: true,
  //       data: result
  //     })
  //   }
  // }
}

const userModel = new UserModel('users')

export default new UserController(userModel)