const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Claim = require('./ClaimModel');

const Document = sequelize.define('document', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    claim: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        references: {
            model: 'claim',
            key: 'id'
        }
    },
    name: {
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

Document.belongsTo(Claim, {
    foreignKey: 'claim',
    as: 'claimAssociation'
});

module.exports = Document;
