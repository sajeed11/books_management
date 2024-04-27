import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/api/auth.js';
import userRoutes from './routes/api/user.js'

// Express app
const app = express();
const PORT = 5000;
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }))

// Auth routes
app.use('/api/auth', authRoutes)

// User routes
app.use('/api/user', userRoutes)

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
