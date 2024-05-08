import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import httpStatus from 'http-status';
import { clientErrorResponse } from '../helpers/handleErrorResponse.js';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  // check the json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(httpStatus.UNAUTHORIZED).json(clientErrorResponse('Please login to view this page'));
      } else {
        next();
      }
    })
  } else {
    res.status(httpStatus.UNAUTHORIZED).json(clientErrorResponse('Please login to view this page'));
  }
}

export default authMiddleware;