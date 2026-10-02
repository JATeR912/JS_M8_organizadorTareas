const { Usuario } = require('../models/modelsIndex');
const { registrarErrorLog } = require('../middleware/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

async function loginUsuario(req, res) {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido && password !== usuario.password) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' });
        }

        const payload = { id: usuario.id, email: usuario.email };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({
            ok: true,
            mensaje: `Sesión iniciada correctamente. Bienvenido ${usuario.nombre}`,
            token: token
        });

    } catch (error) {
        registrarErrorLog('loginUsuario', error.message);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al iniciar sesión'
        });
    }
}

module.exports = { loginUsuario };