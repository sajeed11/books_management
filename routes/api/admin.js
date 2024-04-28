import express from 'express';
// Controllers
import authController from '../../controllers/authController.js';
import userController from '../../controllers/userController.js';
import bookController from '../../controllers/bookController.js';
import AuthorController from '../../controllers/authorController.js';

// Middlewares
import authMiddleware from '../../middlewares/authMiddleware.js';
import adminMiddleware from '../../middlewares/adminMiddleware.js';
import beforeAuthMiddleware from '../../middlewares/beforeAuth.js';

const router = express.Router();

// Auth routes
router.get('/register', authController.registerUser);
router.get('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.post('/login', beforeAuthMiddleware, authController.loginUser);

// Admin with Users
router.get('/users', authMiddleware, adminMiddleware, userController.index)
router.get('/users/:id', authMiddleware, adminMiddleware, userController.getUserById)

// Admin with Books
router.get('/books', authMiddleware, adminMiddleware, bookController.index)
router.get('/books/:id', authMiddleware, adminMiddleware, bookController.getBookById)
router.post('/books', authMiddleware, adminMiddleware, bookController.createBook)
router.put('/books/:id', authMiddleware, adminMiddleware, bookController.approveBook)

// Admin with Authors
router.get('/authors', authMiddleware, adminMiddleware, AuthorController.index)

export default router;