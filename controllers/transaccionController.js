require('dotenv').config()
const {Client} = require('pg')
const { registrarErrorLog } = require('../middleware/logger');

async function registroAvanceTransaccion(req, res) {
    const {id} = req.params;
    const {id_tareas} = req.body;
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        // Inicia la transacción
        await client.query('BEGIN;');

        // Revizar el usuario asociado al proyecto
        const consultarTareaAsociada = await client.query('SELECT t.id AS tarea_id, t.estado, p.usuario_id AS dueno_proyecto FROM tareas t INNER JOIN proyectos p ON t.proyecto_id = p.id WHERE t.id = $1;', [id_tareas]);

        // Validar si existen tareas asociadas al usuario
        if (!consultarTareaAsociada.rows[0]) {
            throw new Error('No hay tareas asociadas al usuario');
        }

        // Validar si la tarea no existe
        if (consultarTareaAsociada.rows.length === 0) {
            throw new Error('La tarea no existe');
        }

        const resultado = consultarTareaAsociada.rows[0];

        // Validar si el proyecto pertenece al usuario
        if (resultado.dueno_proyecto !== parseInt(id, 10)) {
            throw new Error('Esta tarea pertenece a un proyecto que no te pertenece');
        }

        // Validar si la tarea ya está completada
        if (resultado.estado === true) {
            throw new Error('La tarea ya está completada');
        }

        // Actualizar el estado de la tarea
        const actualizarEstadoTarea = await client.query('UPDATE tareas SET estado = true WHERE id = $1 RETURNING id, nombre, estado;', [id_tareas]);

        if (!actualizarEstadoTarea.rows[0]) {
            throw new Error('No se pudo actualizar el estado de la tarea');
        }

        // Registrar el avance
        const registroAvance = await client.query('INSERT INTO log_avance (estado_actual, tarea_id, usuario_id) VALUES (true, $1, $2) RETURNING id, estado_actual;', [id_tareas, id]);

        if (!registroAvance.rows[0]) {
            throw new Error('No se pudo registrar el avance de la tarea');
        }

        // Confirmar la transacción
        await client.query('COMMIT;');

        // Enviar respuesta exitosa
        res.status(200).json({
            ok: true,
            mensaje: 'Registro de avance exitoso',
            usuario_id: id,
            tarea_id: id_tareas,
            tarea: actualizarEstadoTarea.rows[0].nombre,
            avance: registroAvance.rows[0].estado_actual
        });

        // Imprimir  mensaje de éxito en la consola
        console.log(`Registro de avance exitoso. Tarea ${actualizarEstadoTarea.rows[0].id} actualizada a estado ${actualizarEstadoTarea.rows[0].estado} para la tarea ${actualizarEstadoTarea.rows[0].nombre} del usuario ${id}`);

    } catch(error) {
        // Revertir en caso de error
        await client.query('ROLLBACK;');
        registrarErrorLog('registroAvanceTransaccion', error.message);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al registrar el avance de la tarea',
            error: error.message
        });
        console.error('Error al registrar el avance de la tarea:', error.message);
    } finally {
        await client.end();
    }
};

module.exports = {registroAvanceTransaccion}