import UserModel from "../models/User.js";
import AuthorModel from "../models/Author.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { registerRequestSchema, loginRequestSchema } from "../requests/authRequest.js";

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
    const { error } = registerRequestSchema().validate(req.body);

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

    try {
      // Create user
      const newUser = await UserModel.registerUser(userData)

      console.log(newUser)

      // Handle potential database errors
      if (!newUser) {
        return res.status(400).json({ success: false, message: 'User creation failed' });
      }
      // Check if user is an author and create it with the same id
      if (role === 'author' && name && biography) {
        const authorData = {
          user_id: newUser.id,
          name,
          biography,
        };

        try {
          await AuthorModel.addAuthor(authorData);
        } catch (error) {
          // Handle potential duplicate email or other author-specific errors
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Duplicate email' });
          } else {
            // Handle other author-related errors (e.g., missing fields)
            return res.status(400).json({ success: false, message: error.sqlMessage });
          }
        }

        // Return success response with relevant data
        const response = {
          success: true,
          message: role === 'admin' ? 'Admin created successfully' : 'User created successfully',
          data: {
            username,
            email,
            role,
          },
        };

        if (role === 'author') {
          response.data.author = {
            name,
            biography,
          };
        }

        return res.status(201).json(response);
      }
    } catch (error) {
      console.log(error)
      // Handle potential duplicate email or other user-specific errors
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: error.sqlMessage });
      } else {
        return res.status(500).json({ success: false, message: 'User creation failed' });
      }
    }
  }

  // Login user
  static async loginUser(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Please Login' })

    // Validate request 
    const { error } = loginRequestSchema().validate(req.body)

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

  // Logout user
  static async logoutUser(req, res) {
    res.cookie('jwt', '', { maxAge: 1 })
    res.cookie('admin_jwt', '', { maxAge: 1 })
    res.status(200).json(
      {
        success: true,
        message: 'User logged out successfully'
      }
    )
  }
}

export default AuthController;