import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthRequest from "../request/authRequest.js";

class AuthController {

  // Register user
  static async registerUser(req, res) {
    // Validate request
    const authRequest = new AuthRequest();
    const { error } = authRequest.registerRequestSchema().validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
          type: error.details[0].type,
          context: error.details[0].context
        }
      });
    }

    const { username, email, password, role } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = {
      username,
      email,
      password: hashedPassword,
      role
    }

    var result = await UserModel.registerUser(data)

    if (result) {
      res.status(201).json(
        {
          success: true,
          message: 'User created successfully',
          data: {
            username,
            email,
            role
          }
        }
      )
    }
  }

  // Login user
}

export default AuthController;