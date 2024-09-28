const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const flashcardRoutes=require('./routes/flashcards')
app.use('/api/flashcards',flashcardRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Sync Database and Start Server
const startServer = async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
