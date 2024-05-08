import httpStatus from "http-status";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import UserModel from "../models/User.js";
import { registerRequestSchema, loginRequestSchema } from "../requests/authRequest.js";
import { clientErrorResponse, serverErrorResponse } from "../helpers/handleErrorResponse.js";
import { okResponse } from "../helpers/handleOkResponse.js";

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
    // Validate request
    const { error } = registerRequestSchema().validate(req.body);

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

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
      const data = await userModel.registerUser(userData, authorData)

      return res.status(httpStatus.CREATED).json(okResponse(data))
    } catch (error) {
      // console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }
  // Login user
  static async login(req, res) {
    // Validate request 
    const { error } = loginRequestSchema().validate(req.body)

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

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
        // console.log('admin token created')
      }

      return res.status(httpStatus.OK).json(okResponse(result))
    } catch (error) {
      // console.log('Error on login:', error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  // Logout user
  static async logout(req, res) {
    try {
      res.cookie('jwt', '', { maxAge: 1 })
      res.cookie('admin_jwt', '', { maxAge: 1 })
      return res.status(httpStatus.OK).json(okResponse('User logged out'))
    } catch (error) {
      return res.status(httpStatus.NOT_MODIFIED).json(clientErrorResponse(error))
    }
  }
}

export default AuthController;