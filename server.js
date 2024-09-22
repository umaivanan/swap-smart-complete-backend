require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db'); // MongoDB connection
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skill');
const formRoutes = require('./routes/formRoutes'); // Routes for handling form data
const paymentRoutes=require('./routes/paymentRoutes')
// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 9500;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies

// Ensure required directories for file uploads exist
const directories = [
  path.join(__dirname, 'uploads', 'profilePictures'),
  path.join(__dirname, 'pdfUploads'), // Directory for PDFs
];

// Create directories if they don't exist
directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files from the 'uploads' and 'pdfUploads' folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/pdfUploads', express.static(path.join(__dirname, 'pdfUploads')));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/skills', skillRoutes); // Skill routes
app.use('/api/formdata', formRoutes); // Route for handling form data
app.use('/api/paypal', require('./routes/paymentRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

// 404 Error Handling for Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
