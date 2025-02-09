const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const User = require('./UserModel');
const Grade = require('./GradeModel');

const Insurer = sequelize.define('insurer', {
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
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        references: {
            model: Grade,
            key: 'id',
        },
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

Insurer.belongsTo(User, { foreignKey: 'user', as: 'userAssociation' });
Insurer.belongsTo(Grade, { foreignKey: 'grade', as: 'gradeAssociation' });

module.exports = Insurer;
