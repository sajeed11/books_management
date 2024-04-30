import express from "express"
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import customerRoutes from './routes/api/customer.js'
import adminRoutes from './routes/api/admin.js'
import authorRoutes from './routes/api/author.js'

// Express app
const app = express();
const PORT = 5000;
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }))

// Customer routes
app.use('/api/customer', customerRoutes)

// Admin routes
app.use('/api/admin', adminRoutes)

// Author routes
app.use('/api/author', authorRoutes)

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
