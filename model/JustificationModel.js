const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Claim = require('./ClaimModel');
const Region = require('./RegionModel');
const Grade = require('./GradeModel');

const Justification = sequelize.define('justification', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        required: true,
    },
    accused: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        required: true,
        defaultValue: false,
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

Justification.belongsTo(Claim, { foreignKey: 'claim', as: 'claimAssociation' });
Justification.belongsTo(Region, { foreignKey: 'region', as: 'regionAssociation' });
Justification.belongsTo(Grade, { foreignKey: 'grade', as: 'gradeAssociation' });

module.exports = Justification;