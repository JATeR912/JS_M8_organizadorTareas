const { Usuario, Perfil } = require('../models/modelsIndex');
const { registrarErrorLog } = require('../middleware/logger');

async function getPerfilUsuarioById(req, res) {
    const { id } = req.params;

    try {
        // Obtener el perfil asociado al id de usuario pidiendo atributos específicos de cada modelo (para evitar enviar contraseñas)
        const usuario = await Usuario.findByPk(id, {attributes: ['id', 'nombre', 'email', 'fecha_registro'], include: {model: Perfil, as: 'perfil', attributes: ['id', 'avatar_url','telefono', 'sobre_mi']}});

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

async function postPerfil(req,res) {
    const { id } = req.params;
    const { avatar_url, telefono, sobre_mi } = req.body;

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontró el usuario'
            });
        }
        const existePerfil = await Perfil.findOne({ where: { usuario_id: id } });
        if (existePerfil) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario ya tiene un perfil'
            });
        }
        const perfil = await Perfil.create({ usuario_id: id, avatar_url, telefono, sobre_mi });

        res.status(201).json({
            ok: true,
            mensaje: 'Perfil creado exitosamente',
            perfil: perfil
        });
    } catch (error) {
        registrarErrorLog('postPerfil', error.message);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al crear el perfil en la base de datos'
        });
    }
};

async function updatePerfilByUsuarioId(req, res){
    const { id } = req.params;
    const { avatar_url, telefono, sobre_mi } = req.body;
    
    try {
        const campos = {};
        const params = []; // Array auxiliar para verificar si se proporcionaron datos para actualizar
        if (avatar_url !== undefined && avatar_url !== null && avatar_url.trim() !== '') {
            campos.avatar_url = avatar_url;
            params.push(avatar_url);
        };
        if (telefono !== undefined && telefono !== null && telefono.trim() !== '') {
            campos.telefono = telefono;
            params.push(telefono);
        };
        if (sobre_mi !== undefined && sobre_mi !== null && sobre_mi.trim() !== '') {
            campos.sobre_mi = sobre_mi;
            params.push(sobre_mi);
        }
        if (params.length === 0) {
            return res.status(400).json({ 
                ok: false,
                mensaje: 'No se proporcionaron datos para actualizar, debes proporcionar al menos un dato para actualizar' 
            });
        }

        const perfil = await Perfil.update(campos, { where: { usuario_id: id } });

        if (perfil[0] === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontró el usuario asociado al perfil'
            });
        }
        const perfilActualizado = await Perfil.findOne({ where: { usuario_id: id } });
        res.status(200).json({ 
            ok: true,
            mensaje: 'Perfil actualizado correctamente',
            usuario_id: id, 
            perfil: perfilActualizado
        });
    } catch (error) {
        registrarErrorLog('updatePerfilByUsuarioId', error.message);
        res.status(500).json({ 
            ok: false,
            mensaje: 'Error al actualizar el perfil en la base de datos' 
        });
    }
};


//Se elimina el usuario, solo por ejemplo de borrado por datos solo se mantendria con activo = false en ususario sin borrado fisico
async function deletePerfilByUsuarioId(req, res) {
    const { id } = req.params;

    try {
        const perfil = await Perfil.destroy({ where: { usuario_id: id } });
        if (perfil === 0) {
                return res.status(404).json({
                ok: false,
                error: 'Perfil asociado al usuario no encontrado'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Perfil del usuario eliminado',
        });
    
    } catch (error) {
        registrarErrorLog('deletePerfilByUsuarioId', error.message);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar perfil del usuario de la base de datos'
        });
    }
};

module.exports = { 
    getPerfilUsuarioById,
    postPerfil,
    updatePerfilByUsuarioId,
    deletePerfilByUsuarioId
};