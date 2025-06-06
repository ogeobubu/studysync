const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const advisingRoutes = require('./routes/advising');

const createApp = () => {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Connect to database
  connectDB(process.env.MONGO_URI);
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/advising', advisingRoutes);
  
  // Error handling middleware (functional)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
  });
  
  return app;
};

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));