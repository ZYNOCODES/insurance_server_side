const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Observation = sequelize.define('observation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    age: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        required: true,
    },
    payment: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});


module.exports = Observation;
