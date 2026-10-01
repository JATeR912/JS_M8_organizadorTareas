const { ejecutarConsulta } = require('../config/db');
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
        const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, activo, fecha_registro';
        const usuario = await ejecutarConsulta(sql, [nombre.trim(), email.trim(), password]);

        res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado exitosamente',
            usuario: usuario[0]
        });
    } catch (error) {
        registrarErrorLog('postUsuario', error.message);
        if (error.code === '23505') {
            return res.status(400).json({
                ok: false,
                mensaje: 'El correo electrónico ya está registrado'
            });
        }

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al crear el usuario en la base de datos'
        });
    }
}

async function getUsuarios(req, res) {
    try {
        const sql = 'SELECT id, nombre, email, fecha_registro, activo FROM usuarios';
        const usuarios = await ejecutarConsulta(sql);

        res.status(200).json({
            ok: true,
            total: usuarios.length,
            data: usuarios
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
        const sql = 'SELECT id, nombre, email, fecha_registro, activo FROM usuarios WHERE id = $1';
        const usuario = await ejecutarConsulta(sql, [id]);
        if (usuario.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontró el usuario'
            });
        }
        res.status(200).json({
            ok: true,
            data: usuario[0]
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
    const campos = [];
    const params = [];
    let contadorParametros = 1; // Para ir generando los parámetros $1, $2 y $3 (maximo en esta caso)

    if (nombre !== undefined) {
        campos.push(`nombre = $${contadorParametros}`);
        params.push(nombre);
        contadorParametros++;
    }

    if (email !== undefined) {
        campos.push(`email = $${contadorParametros}`);
        params.push(email);
        contadorParametros++;
    }

    if (params.length === 0) {
        return res.status(400).json({ 
            mensaje: 'No se enviaron datos para actualizar' 
        });
    }

    params.push(id);

    const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = $${contadorParametros} RETURNING nombre, email`;
    try {
        const usuario = await ejecutarConsulta(sql, params);
        if (usuario.length === 0) {
            return res.status(404).json({ 
                mensaje: 'Usuario no encontrado' 
            });
        }
        res.status(200).json({ 
            mensaje: 'Usuario actualizado correctamente', 
            Usuario: usuario[0] });
    } catch (error) {
        registrarErrorLog('updateUsuarioById', error.message)
        res.status(500).json({ 
            mensaje: 'Error al actualizar el usuario en la base de datos' 
        });
    }
};


//Se elimina el usuario, solo por ejemplo de borrado por datos solo se mantendria con activo = false sin borrado fisico
async function deleteUsuarioById(req, res) {
    const { id } = req.params;

    try {
        const usuario = await ejecutarConsulta('DELETE FROM usuarios WHERE id=$1 RETURNING  id', [id]);
        if (usuario.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado',
            usuario: usuario[0]
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