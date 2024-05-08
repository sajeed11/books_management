import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import userController from '../controllers/userController.js';
import httpStatus from 'http-status';
import { clientErrorResponse } from '../helpers/handleErrorResponse.js';

dotenv.config()

const adminMiddleware = (req, res, next) => {
  const token = req.cookies.admin_jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(httpStatus.UNAUTHORIZED).json(clientErrorResponse('Not authorized'))
      } else next()
    })
  } else {
    res.status(httpStatus.UNAUTHORIZED).json(clientErrorResponse('Not authorized'))
  }
}

export default adminMiddleware;