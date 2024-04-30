import express from 'express';

// Controllers
import authController from '../../controllers/authController.js';
import bookController from '../../controllers/bookController.js';
import authorController from '../../controllers/authorController.js';
import genreController from '../../controllers/genreController.js';

// Middlewares
import authMiddleware from '../../middlewares/authMiddleware.js';
import beforeAuthMiddleware from '../../middlewares/beforeAuth.js';

const router = express.Router();

// Auth routes
router.get('/register', authController.register);
router.get('/login', authController.login);
router.post('/register', authController.register);
router.post('/login', beforeAuthMiddleware, authController.login);
router.get('/logout', authController.logout);

// Customer with Books
router.get('/books', authMiddleware, bookController.readAll)
router.get('/books/:id', authMiddleware, bookController.readById)

// Customer with Authors
router.get('/authors', authMiddleware, authorController.readAll)
router.get('/authors/:id', authMiddleware, authorController.readById)

// Customer with Genres
router.get('/genres', authMiddleware, genreController.readAll)
router.get('/genres/:id', authMiddleware, genreController.readById)

export default router;