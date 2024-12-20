const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const User = require('./UserModel');

const Admin = sequelize.define('admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        references: {
            model: 'user',
            key: 'id'
        }
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

Admin.belongsTo(User, {
    foreignKey: 'user',
    as: 'userAssociation'
});

module.exports = Admin;
