const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Policy = sequelize.define('policy', {
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
    limit: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        required: true,
    },
    co_pay: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        required: true,
    },
    exclusions: {
        type: DataTypes.TEXT,
        allowNull: false,
        required: true,
    },
    timeframe: {
        type: DataTypes.INTEGER,
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


module.exports = Policy;
