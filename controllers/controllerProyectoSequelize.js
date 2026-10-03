const { Usuario, Proyecto } = require('../models/modelsIndex');
const { registrarErrorLog } = require('../middleware/logger');

async function getProyectosUsuarioById(req, res) {
    const { id } = req.params;
    const usuarioAutenticadoId = req.usuario.id;

    if (parseInt(id) !== parseInt(usuarioAutenticadoId)) {
        return res.status(403).json({
            ok: false,
            mensaje: 'Acceso denegado: No tienes permisos para ver la información de otro usuario'
        });
    }

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
        registrarErrorLog('getProyectosUsuarioById', error.message);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener los proyectos del usuario'
        });
    }
};

async function postProyecto(req,res) {
    const { id } = req.params;
    const {titulo, descripcion, privado } = req.body;
    const usuarioAutenticadoId = req.usuario.id;

    if (parseInt(id) !== parseInt(usuarioAutenticadoId)) {
        return res.status(403).json({
            ok: false,
            mensaje: 'Acceso denegado: No tienes permisos para ver la información de otro usuario'
        });
    }

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontró el usuario'
            });
        }
        if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
            return res.status(400).json({
                ok: false,
                mensaje: 'El título del proyecto es obligatorio'
            });
        }
        const existeProyecto = await Proyecto.findOne({ where: { titulo, usuario_id: id } });
        if (existeProyecto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El proyecto ya existe'
            });
        }

        const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

        const proyecto = await Proyecto.create({ usuario_id: id, titulo, descripcion, imagen_url, privado });

        res.status(201).json({
            ok: true,
            mensaje: 'Proyecto creado exitosamente',
            proyecto: proyecto
        });
    } catch (error) {
        registrarErrorLog('postProyecto', error.message);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al crear el proyecto en la base de datos'
        });
    }
};

async function updateProyectoByUsuarioId(req, res){
    const { id, proyecto_id } = req.params;
    const { titulo, descripcion, privado } = req.body;
    const usuarioAutenticadoId = req.usuario.id;
    
    if (parseInt(id) !== parseInt(usuarioAutenticadoId)) {
        return res.status(403).json({
            ok: false,
            mensaje: 'Acceso denegado: No tienes permisos para ver la información de otro usuario'
        });
    }

    try {
        const campos = {};
        const params = []; // Array auxiliar para verificar si se proporcionaron datos para actualizar
        if (titulo !== undefined && titulo !== null && typeof titulo === 'string' && titulo.trim() !== '') {
            campos.titulo = titulo.trim();
            params.push(titulo);
        }

        if (descripcion !== undefined && descripcion !== null && typeof descripcion === 'string' && descripcion.trim() !== '') {
            campos.descripcion = descripcion.trim();
            params.push(descripcion);
        }
        if (privado !== undefined && privado !== null) {
            campos.privado = privado;
            params.push(privado);
        }
        if (params.length === 0) {
            return res.status(400).json({ 
                ok: false,
                mensaje: 'No se proporcionaron datos para actualizar, debes proporcionar al menos un dato para actualizar' 
            });
        }

        const proyecto = await Proyecto.update(campos, { where: { usuario_id: id, id: proyecto_id } });

        if (proyecto[0] === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontró el proyecto asociado al usuario'
            });
        }
        const proyectoActualizado = await Proyecto.findOne({ where: { usuario_id: id, id: proyecto_id } });
        res.status(200).json({ 
            ok: true,
            mensaje: 'Proyecto actualizado correctamente',
            usuario_id: id, 
            proyecto: proyectoActualizado
        });
    } catch (error) {
        registrarErrorLog('updateProyectoByUsuarioId', error.message);
        res.status(500).json({ 
            ok: false,
            mensaje: 'Error al actualizar el proyecto en la base de datos' 
        });
    }
};

async function deleteProyectoByUsuarioId(req, res) {
    const { id, proyecto_id } = req.params;
    const usuarioAutenticadoId = req.usuario.id;

    if (parseInt(id) !== parseInt(usuarioAutenticadoId)) {
        return res.status(403).json({
            ok: false,
            mensaje: 'Acceso denegado: No tienes permisos para ver la información de otro usuario'
        });
    }

    try {
        const proyecto = await Proyecto.destroy({ where: { id: proyecto_id, usuario_id: id } });
        if (proyecto === 0) {
                return res.status(404).json({
                ok: false,
                error: 'Proyecto asociado al usuario no encontrado'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Proyecto del usuario eliminado',
        });
    
    } catch (error) {
        registrarErrorLog('deleteProyectoByUsuarioId', error.message);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar proyecto del usuario de la base de datos'
        });
    }
};


module.exports = { 
    getProyectosUsuarioById,
    postProyecto,
    updateProyectoByUsuarioId,
    deleteProyectoByUsuarioId
};