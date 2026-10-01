const fs = require('fs');
const path = require('path');

const RUTA_LOGS = path.join(__dirname, '../logs/log.txt');

const loggerMiddleware = (req, res, next) => {
  try {
    const fecha = new Date().toISOString();
    const metodo = req.method;
    const ruta = req.url;

    const registro = `[INFO] [${fecha}] ${metodo} ${ruta}\n`;

    fs.appendFileSync(RUTA_LOGS, registro, 'utf8');
  } catch (error) {
    console.error('Error al escribir en el log.txt:', error.message);
  }
  next();
};

const registrarErrorLog = (origen, mensajeError) => {
  try {
    const fecha = new Date().toISOString();
    const registro = `[ERROR] [${fecha}] En ${origen}: ${mensajeError}\n`;
    fs.appendFileSync(RUTA_LOGS, registro, 'utf8');
  } catch (error) {
    console.error('Error al escribir en el log.txt:', error.message);
  }
};

module.exports = { loggerMiddleware, registrarErrorLog };