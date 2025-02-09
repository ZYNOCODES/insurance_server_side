const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Client = require('./ClientModel');
const MedicalService = require('./MedicalServiceModel');
const Insurer = require('./InsurerModel');
const Region = require('./RegionModel');

const Claim = sequelize.define('claim', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    client: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        references: {
            model: Client,
            key: 'id',
        },
    },
    medicalservice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        references: {
            model: MedicalService,
            key: 'id',
        },
    },
    insurer: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true,
        references: {
            model: Insurer,
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'paid'),
        defaultValue: 'pending',
        required: true,
    },
    closed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        required: true,
    },
    claim_amount: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    region: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        references: {
            model: Region,
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        required: true,
        defaultValue: DataTypes.NOW,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

Claim.belongsTo(Client, { foreignKey: 'client', as: 'clientAssociation' });
Claim.belongsTo(MedicalService, { foreignKey: 'medicalservice', as: 'medicalServiceAssociation' });
Claim.belongsTo(Insurer, { foreignKey: 'insurer', as: 'insurerAssociation' });
Claim.belongsTo(Region, { foreignKey: 'region', as: 'regionAssociation' });

module.exports = Claim;
