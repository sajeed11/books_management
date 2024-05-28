import express from 'express';

// Controllers
import authController from '../controllers/authController.js';
import bookController from '../controllers/bookController.js';
import authorController from '../controllers/authorController.js';
import genreController from '../controllers/genreController.js';
import orderController from '../controllers/orderController.js';

// Middlewares
import authMiddleware from '../middlewares/authMiddleware.js';
import beforeAuthMiddleware from '../middlewares/beforeAuth.js';

const router = express.Router();

// Auth routes
router.post('/register', authController.register);
router.post('/login', beforeAuthMiddleware, authController.login);
router.get('/logout', authController.logout);

// Customer with Books
router.get('/books', bookController.readAll) // authMiddlewar, the user can see all the books
router.get('/books/:id', bookController.readById) // authMiddleware, the user can see a single book
router.post('/books/search', bookController.search)

// Customer with Authors
router.get('/authors', authMiddleware, authorController.readAll)
router.get('/authors/:id', authMiddleware, authorController.readById)
router.post('/authors/search', authMiddleware, authorController.search)

// Customer with Genres
router.get('/genres', authMiddleware, genreController.readAll)
router.get('/genres/:id', authMiddleware, genreController.readById)

// Customer with Orders
router.post('/:customer_id/orders', authMiddleware, orderController.order)
router.get('/:customer_id/orders', authMiddleware, orderController.readOwnAll)
router.get('/:customer_id/orders/:order_id', authMiddleware, orderController.readOwnById)
// router.post('/:customer_id/orders/:order_id', authMiddleware, orderController.cancelOwnById)

export default router;
