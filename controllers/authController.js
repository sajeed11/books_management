import UserModel from "../models/User.js";
import AuthorModel from "../models/Author.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import AuthRequest from "../requests/authRequest.js";

dotenv.config();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, secret) => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge
  })
}

class AuthController {

  // Register user
  static async registerUser(req, res) {
    // Check if request method is POST
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Please Register' })

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

    const data = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // User data for both tables
    const userData = {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role
    };

    // Create user
    var result = await UserModel.registerUser(userData)

    if (result) {

      // Check if user is an author and create it with the same id
      if (data.role === 'author') {
        const authorData = {
          id: result.id,
          name: data.name,
          biography: data.biography
        }

        var authorResult = await AuthorModel.addAuthor(authorData)

        if (authorResult) {
          return res.status(201).json(
            {
              success: true,
              message: 'Author created successfully',
              data: {
                username,
                email,
                role,
                authorData: {
                  name: data.name,
                  biography: data.biography
                }
              }
            }
          )
        } else {
          return res.status(400).json(
            {
              success: false,
              message: 'Author not created'
            }
          )
        }
      } else {
        if (data.role === 'admin') {
          return res.status(201).json(
            {
              success: true,
              message: 'Admin created successfully',
              data: {
                username,
                email,
                role
              }
            }
          )
        } else {
          return res.status(201).json(
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
    } else {
      return res.status(400).json(
        {
          success: false,
          message: 'User not created'
        }
      )
    }
  }

  // Login user
  static async loginUser(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Please Login' })

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
      const token = createToken(result[0].id, process.env.JWT_SECRET)
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

      // create an admin token
      if (result[0].role === 'admin') {
        const adminToken = createToken(result[0].id, process.env.ADMIN_JWT_SECRET)
        res.cookie('admin_jwt', adminToken, { httpOnly: true, maxAge: maxAge * 1000 })
        console.log('admin token created')
      }

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