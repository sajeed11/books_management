import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const beforeAuthMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  // check the json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect('login')
      } else {
        res.status(200).json(
          {
            success: true,
            message: "User already logged in",
          }
        )
      }
    })
  } else {
    next();
  }
}

export default beforeAuthMiddleware;