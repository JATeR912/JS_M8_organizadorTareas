require('dotenv').config();
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Proyecto = sequelize.define('Proyecto', {
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    imagen_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    privado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
},
{
    tableName: 'proyectos',
    timestamps: false
});

module.exports = { Proyecto };