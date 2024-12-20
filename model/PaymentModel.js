const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Claim = require('./ClaimModel');

const Payment = sequelize.define('payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    claim: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        references: {
            model: Claim,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    validation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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

Payment.belongsTo(Claim, { foreignKey: 'claim', as: 'claimAssociation' });

module.exports = Payment;
