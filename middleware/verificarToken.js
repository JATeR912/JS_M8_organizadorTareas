const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
        return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
    req.usuario = decoded;
        next();
    });
};

module.exports = { verificarToken };