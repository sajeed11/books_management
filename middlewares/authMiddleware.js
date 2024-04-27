import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  // check the json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect('api/auth/login');
      } else {
        next();
      }
    })
  } else {
    res.redirect('api/auth/login');
  }
}

export default authMiddleware;