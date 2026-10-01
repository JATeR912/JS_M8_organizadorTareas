require('dotenv').config();
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const LogAvance = sequelize.define('LogAvance', {
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    estado_actual: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    tiempo_dedicado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
},
{
    tableName: 'log_avance',
    timestamps: false
}
);

module.exports = { LogAvance };