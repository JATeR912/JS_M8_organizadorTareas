const { Proyecto, Tarea } = require('../models/modelsIndex');
const { registrarErrorLog } = require('../middleware/logger');

async function getTareasByProyectoId(req, res) {
    const { id, proyecto_id } = req.params;
    const usuarioAutenticadoId = req.usuario.id;

    if (parseInt(id) !== parseInt(usuarioAutenticadoId)) {
        return res.status(403).json({
            ok: false,
            mensaje: 'Acceso denegado: No tienes permisos para ver la información de otro usuario'
        });
    }

    try {
        // Verifica que el proyecto exista y pertenezca al usuario, e incluye sus tareas
        const proyecto = await Proyecto.findOne({
            where: { id: proyecto_id, usuario_id: id },
            include: {
                model: Tarea,
                as: 'tareas'
            }
        });

        if (!proyecto) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontró el proyecto o no pertenece al usuario'
            });
        }

        res.status(200).json({
            ok: true,
            proyecto_id: proyecto.id,
            titulo_proyecto: proyecto.titulo,
            tareas: proyecto.tareas
        });
    } catch (error) {
        registrarErrorLog('getTareasByProyectoId', error.message);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener las tareas del proyecto'
        });
    }
}

module.exports = {
    getTareasByProyectoId
};