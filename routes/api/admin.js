import express from 'express';
// Controllers
import userController from '../../controllers/userController.js';
import bookController from '../../controllers/bookController.js';
import authController from '../../controllers/authController.js';

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

router.get('/users', authMiddleware, adminMiddleware, userController.index)
router.get('/users/:id', authMiddleware, adminMiddleware, userController.getUserById)
router.get('books', authMiddleware, adminMiddleware, bookController.index)
router.get('books/:id', authMiddleware, adminMiddleware, bookController.getBookById)
router.post('/books', authMiddleware, adminMiddleware, bookController.createBook)
router.put('/books/:id', authMiddleware, adminMiddleware, bookController.approveBook)

export default router;