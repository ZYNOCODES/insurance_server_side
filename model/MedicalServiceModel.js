const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const User = require('./UserModel');

const MedicalService = sequelize.define('medicalservice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    type: {
        type: DataTypes.ENUM('doctor', 'pharmacy', 'organisation'),
        allowNull: false,
        defaultValue: 'organisation',
        required: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

MedicalService.belongsTo(User, { foreignKey: 'user', as: 'userAssociation' });

module.exports = MedicalService;
