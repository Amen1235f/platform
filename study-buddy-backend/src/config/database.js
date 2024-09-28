const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('study_buddy', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

  

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
