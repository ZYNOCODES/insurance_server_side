const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const User = require('./UserModel');

const Client = sequelize.define('client', {
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
    age: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    job: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    married: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

Client.belongsTo(User, { foreignKey: 'user', as: 'userAssociation' });

module.exports = Client;
