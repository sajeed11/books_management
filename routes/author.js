import express from 'express';

// Controllers
import bookController from '../controllers/bookController.js';
import authController from '../controllers/authController.js';
import genreController from '../controllers/genreController.js';
import authorRequestController from '../controllers/authorRequestController.js';

// Middlewares
import authMiddleware from '../middlewares/authMiddleware.js';
import beforeAuthMiddleware from '../middlewares/beforeAuth.js';
import { uploadFile } from '../middlewares/uploadFiles.js';

const router = express.Router();

// Auth routes
router.post('/register', authController.register);
router.post('/login', beforeAuthMiddleware, authController.login);
router.get('/logout', authController.logout)

// Author with books
// Here we assume the author can show all the books like the admin does
// We can let the author see only the ready books by editing the readAll method in bookController.js
router.get('/books', authMiddleware, bookController.readAll)
// Same as above
router.get('/books/:id', authMiddleware, bookController.readById)
router.post('/books', authMiddleware, uploadFile.single('picture'), bookController.createBook)
router.put('/books/:id', authMiddleware, bookController.updateBook)
router.post('/books/:id', authMiddleware, bookController.deleteBook)

// Author with Genres
router.get('/genres', authMiddleware, genreController.readAll)
router.get('/genres/:id', authMiddleware, genreController.readById)

// Author with his request
router.get('/author_requests/:id', authMiddleware, authorRequestController.read)
router.delete('/author_requests/:id', authMiddleware, authorRequestController.delete)

export default router;