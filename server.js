import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to database and cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// API endpoints
app.use('/api/admin', adminRouter);


// Test route
app.get('/', (req, res) => {
  res.send('API is working so great');
});

// Start server
app.listen(port, () => console.log(`Server started at port ${port}`));
