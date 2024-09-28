const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures username is unique
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Password cannot be null
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure the email is unique
        validate: {
            isEmail: true // Ensure email format is valid
        }
    },
}, {
    tableName: 'Users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = User;
