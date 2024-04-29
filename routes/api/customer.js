import express from 'express';

// Controllers
import bookController from '../../controllers/bookController.js';
import authController from '../../controllers/authController.js';

// Middlewares
import authMiddleware from '../../middlewares/authMiddleware.js';
import beforeAuthMiddleware from '../../middlewares/beforeAuth.js';

const router = express.Router();

// Auth routes
router.get('/register', authController.registerUser);
router.get('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.post('/login', beforeAuthMiddleware, authController.loginUser);
router.get('/logout', authController.logoutUser);

// router.get('/books', authMiddleware, bookController.getAllBooks)
// router.get('/books/:id', authMiddleware, bookController.getBookById)

export default router;