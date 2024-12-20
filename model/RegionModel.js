const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = User;
