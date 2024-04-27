import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/api/auth.js';
import userRoutes from './routes/api/user.js'

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// Auth routes
app.use('/api/auth', authRoutes)

app.use('/', userRoutes)

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
