require('dotenv').config();
const { sequelize } = require('../config/db');
const {DataTypes} = require('sequelize');

const Perfil = sequelize.define('Perfil', {
    avatar_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    sobre_mi: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
},
{
        tableName: 'perfiles',
        timestamps: false
    }
);

module.exports = {Perfil};