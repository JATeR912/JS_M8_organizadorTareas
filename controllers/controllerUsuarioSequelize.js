const { Usuario } = require('../models/usuario');
const { registrarErrorLog } = require('../middleware/logger');

function getHome(req, res) {
    const datos = {
        tituloPrincipal: 'Tu espacio de tareas',
        descripcion: 'Bienvenida a Disper, Organiza tus futuros o proyectos o tus tareas del dia a dia',
        nombreProyecto: 'disper',
        autor: 'JATeR',
        lista:['leer', 'escribir', 'programar', 'dormir', 'comer']
        };
    res.render('home', datos);
};

function getTareas(req, res) {

    const datos = {
        tituloPrincipal: 'Tu espacio de tareas',
        descripcion: 'Bienvenida a Disper, Organiza tus futuros o proyectos o tus tareas del dia a dia',
        nombreProyecto: 'disper',
        autor: 'JATeR',
        lista:['leer', 'escribir', 'programar', 'dormir', 'comer']
        };
  res.render('tareas', datos);
};

function getStatus(req, res) {
    res.json({
        status: 'ok',
        app: 'disper',
        autor: 'JATeR',
        timestamp: new Date().toISOString()
    });
};

async function postUsuario(req,res) {
    const { nombre, email, password } = req.body;

    try {
        const usuario = await Usuario.create({ nombre, email, password });

        res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado exitosamente',
            usuario: usuario
        });
    } catch (error) {
        registrarErrorLog('postUsuario', error.message);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al crear el usuario en la base de datos'
        });
    }
};

async function getUsuarios(req, res) {
    try {
        const usuario = await Usuario.findAll({attributes: ['id', 'nombre', 'email', 'fecha_registro']});

        res.status(200).json({
            ok: true,
            total: usuario.length,
            data: usuario
        });
    } catch (error) {
        registrarErrorLog('getUsuarios', error.message);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener usuarios de la base de datos'
        });
    }
};

async function getUsuarioById(req, res) {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id, {attributes: ['id', 'nombre', 'email', 'fecha_registro']});
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


async function updateUsuarioById(req, res){
    const { id } = req.params;
    const { nombre, email } = req.body; //Usuarios tienen nombre, email, password, fecha_registro, activo. Por lo tanto fecha registo y activo no tienen que ser actualizados por el usuario y Password tampoco se actualiza desde esta ruta
    
    try {
        const campos = {};
        if (nombre !== undefined && nombre !== null && nombre.trim() !== '') {
            campos.nombre = nombre;
        }
        if (email !== undefined && email !== null && email.trim() !== '') {
            campos.email = email;
        }
        const usuario = await Usuario.update(campos, { where: { id } });

        if (usuario[0] === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontró el usuario'
            });
        }
        res.status(200).json({ 
            mensaje: 'Usuario actualizado correctamente', 
            id: id,
            nombre: nombre
        });
    } catch (error) {
        registrarErrorLog('updateUsuarioById', error.message);
        res.status(500).json({ 
            mensaje: 'Error al actualizar el usuario en la base de datos' 
        });
    }
};


//Se elimina el usuario, solo por ejemplo de borrado por datos solo se mantendria con activo = false sin borrado fisico
async function deleteUsuarioById(req, res) {
    const { id } = req.params;

    try {
        const usuario = await Usuario.destroy({ where: { id } });
        if (usuario === 0) {
                return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado',
        });
    
    } catch (error) {
        registrarErrorLog('deleteUsuarioById', error.message);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar usuario de la base de datos'
        });
    }
};

function getNotFound(req, res) {
  res.status(404).render('404', { nombreProyecto: 'disper', autor: 'JATeR' });
}

module.exports = {
    getHome, 
    getTareas, 
    getStatus,
    postUsuario,    
    getUsuarios,
    getUsuarioById,
    updateUsuarioById,
    deleteUsuarioById,
    getNotFound
};