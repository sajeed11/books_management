import express from 'express';

// Controllers
import bookController from '../../controllers/bookController.js';
import authController from '../../controllers/authController.js';

// Middlewares
import authMiddleware from '../../middlewares/authMiddleware.js';
import beforeAuthMiddleware from '../../middlewares/beforeAuth.js';

const router = express.Router();

// Auth routes
router.get('/register', authController.register);
router.get('/login', authController.login);
router.post('/register', authController.register);
router.post('/login', beforeAuthMiddleware, authController.login);
router.get('/logout', authController.logout)

router.get('/books', authMiddleware, bookController.readAll)
router.get('/books/:id', authMiddleware, bookController.readById)
router.post('/books', authMiddleware, bookController.create)

export default router;