import UserModel from "../models/User.js";
import AuthorModel from "../models/Author.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { registerRequestSchema, loginRequestSchema } from "../requests/authRequest.js";
import httpStatus from "http-status";

// Create an instance of the UserModel
const userModel = new UserModel('users');

dotenv.config();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, secret) => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge
  })
}

class AuthController {

  // Register user
  static async register(req, res) {
    // Check if request method is POST
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Please Register' })

    // Validate request
    const { error } = registerRequestSchema().validate(req.body);

    if (error) {
      return res.status(httpStatus.BAD_REQUEST)
        .json({
          success: false,
          error: {
            message: error.details[0].message,
            type: error.details[0].type,
            context: error.details[0].context
          }
        });
    }

    const { username, email, password, role, name, biography } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // User data for both tables
    const userData = {
      username,
      email,
      password: hashedPassword,
      role,
    };

    const authorData = {
      name,
      biography,
    };

    try {
      await userModel.registerUser(userData, authorData)

      return res.status(httpStatus.OK)
        .json({
          success: true,
          message: "User Created with success",
        })

    } catch (error) {
      // console.log(error)
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(httpStatus.BAD_REQUEST)
          .json({
            success: false,
            error: {
              message: error.sqlMessage,
              code: error.code
            }
          });
      } else if (error.code === 'ER_BAD_NULL_ERROR') {
        return res.status(httpStatus.BAD_REQUEST)
          .json({
            success: false,
            error: {
              message: error.sqlMessage,
              code: error.code
            }
          });
      } else {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            error: {
              message: error.sqlMessage,
              code: error.code
            }
          });
      }
    }
  }
  // Login user
  static async login(req, res) {
    if (req.method !== 'POST') {
      return res.status(httpStatus.TEMPORARY_REDIRECT)
        .json({
          success: false,
          message: 'Please Login'
        })
    }

    // Validate request 
    const { error } = loginRequestSchema().validate(req.body)

    if (error) {
      return res.status(httpStatus.BAD_REQUEST)
        .json({
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

    try {
      const result = await userModel.loginUser(data)

      const token = createToken(result[0].id, process.env.JWT_SECRET)
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

      // create an admin token
      if (result[0].role === 'admin') {
        const adminToken = createToken(result[0].id, process.env.ADMIN_JWT_SECRET)
        res.cookie('admin_jwt', adminToken, { httpOnly: true, maxAge: maxAge * 1000 })
        console.log('admin token created')
      }

      return res.status(httpStatus.OK)
        .json({
          success: true,
          message: "Logged In with success",
          data: {
            username: result[0].username,
            email: result[0].email
          }
        })

    } catch (error) {
      console.log('Error on login:', error)
      return res.status(httpStatus.BAD_REQUEST)
        .json({
          success: false,
          message: error.message
        })
    }
  }

  // Logout user
  static async logout(req, res) {
    res.cookie('jwt', '', { maxAge: 1 })
    res.cookie('admin_jwt', '', { maxAge: 1 })
    res.status(httpStatus.OK)
      .json(
        {
          success: true,
          message: 'User logged out successfully'
        }
      )
  }
}

export default AuthController;