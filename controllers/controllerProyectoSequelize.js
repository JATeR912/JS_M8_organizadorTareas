const { Usuario, Proyecto } = require('../models/modelsIndex');
const { registrarErrorLog } = require('../middleware/logger');

async function getProyectosUsuarioById(req, res) {
    const { id } = req.params;

    try {
        // Obtener el usuario por su ID y sus proyectos asociados pidiendo atributos específicos de cada modelo (para evitar enviar contraseñas)
        const usuario = await Usuario.findByPk(id, {attributes: ['id', 'nombre', 'email', 'fecha_registro'], include: {model: Proyecto, as: 'proyectos', attributes: ['id','titulo','descripcion', 'fecha_creacion', 'imagen_url', 'privado']}});

    if (!usuario) {
        return res.status(404).json({
            ok: false,
            mensaje: 'No se encontró el usuario'
        });
    }
    res.status(200).json({
        ok: true,
        data: usuario
    });
    } catch (error) {
        registrarErrorLog('getUsuarioById', error.message);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener usuario de la base de datos'
        });
    }
};

module.exports = { getProyectosUsuarioById };