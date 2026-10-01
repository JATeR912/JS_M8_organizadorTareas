require('dotenv').config();
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Tarea = sequelize.define('Tarea', {
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
},
{
    tableName: 'tareas',
    timestamps: false
});

module.exports = { Tarea };