const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Grade = sequelize.define('grade', {
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
    exclusions: {
        type: DataTypes.ENUM('secure', 'confidential', 'unclassified'),
        allowNull: false,
        required: true,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Grade;
