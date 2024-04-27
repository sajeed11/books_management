import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import userController from '../controllers/userController.js';

dotenv.config();

const adminMiddleware = (req, res, next) => {
  const token = req.cookies.admin_jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      } else next();
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
}

export default adminMiddleware;