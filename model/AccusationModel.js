const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Justification = require('./JustificationModel');

const Accusation = sequelize.define('accusation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    justification: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        references: {
            model: 'justification',
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        required: true,
    },
    status: {
        type: DataTypes.ENUM('approved', 'rejected', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
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

Accusation.belongsTo(Justification, {
    foreignKey: 'justification',
    as: 'justificationAssociation'
});

module.exports = Accusation;
