import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import AuthRequest from "../request/authRequest.js";

dotenv.config();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  })
}

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
  static async loginUser(req, res) {
    // Validate request 
    const authRequest = new AuthRequest();
    const { error } = authRequest.loginRequestSchema().validate(req.body);

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

    const { email, password } = req.body;

    const data = {
      email,
      password
    }

    var result = await UserModel.loginUser(data)

    if (result) {
      const token = createToken(result[0].id)
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
      res.status(200).json(
        {
          success: true,
          message: 'User logged in successfully',
          data: {
            username: result[0].username,
            email: result[0].email,
            role: result[0].role
          }
        }
      )
    } else {
      res.status(400).json(
        {
          success: false,
          message: 'Invalid email or password'
        }
      )
    }
  }
}

export default AuthController;