import express from 'express';

// Controllers
import authController from '../../controllers/authController.js';
import userController from '../../controllers/userController.js';
import bookController from '../../controllers/bookController.js';
import authorController from '../../controllers/authorController.js';

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
router.get('/users', userController.readAll) // authMiddleware, adminMiddleware,
router.get('/users/:id', userController.readById) // authMiddleware, adminMiddleware,
router.delete('/users/:id', userController.delete)

// Admin with Books
router.get('/books', bookController.readAll) // authMiddleware, adminMiddleware,
router.get('/books/:id', bookController.readById) // authMiddleware, adminMiddleware,
router.post('/books', bookController.createBook) //authMiddleware, adminMiddleware,
router.put('/books/:id', bookController.approveBook) //authMiddleware, adminMiddleware,
router.delete('/books/:id', bookController.delete) //authMiddleware, adminMiddleware,

// Admin with Authors
router.get('/authors', authMiddleware, adminMiddleware, authorController.readAll)
router.get('/authors/:id', authMiddleware, adminMiddleware, authorController.readById)
// router.delete('./author/:id', authMiddleware, adminMiddleware, authorController.deleteAuthor)

export default router;