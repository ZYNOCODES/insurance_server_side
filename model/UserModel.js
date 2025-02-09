const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Region = require('./RegionModel');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    fullname: {
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
}, {
    freezeTableName: true,
    timestamps: false,
});

User.belongsTo(Region, { foreignKey: 'region', as: 'regionAssociation' });


module.exports = User;
