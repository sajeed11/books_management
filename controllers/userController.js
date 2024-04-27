import UserModel from "../models/User.js";

class UserController {
  static async getAllUser(req, res) {
    var result = await UserModel.getUser()

    if (result) {
      res.status(200).json(result)
    }
  }
}

export default UserController;