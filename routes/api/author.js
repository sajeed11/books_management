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

// Author with books
// Here we assume the author can show all the books like the admin does
// We can let the author see only the ready books by editing the readAll method in bookController.js
router.get('/books', authMiddleware, bookController.readAll)
// Same as above
router.get('/books/:id', authMiddleware, bookController.readById)
router.post('/books', authMiddleware, bookController.createBook)
router.put('/books/:id', authMiddleware, bookController.updateBook)
router.delete('/books/:id', authMiddleware, bookController.requestToDelete)

export default router;