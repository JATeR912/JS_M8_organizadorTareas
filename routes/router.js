const express = require('express');
const router = express.Router();
//Middleware
const { validarId } = require('../middleware/validarId');
const {validarCrearUsuario, validarActualizarUsuario} = require('../middleware/validarUsuario');
const { uploadFile } = require('../middleware/uploadFile');
const { loginUsuario } = require('../controllers/controllerLoginSequelice');
const { verificarToken } = require('../middleware/verificarToken');
const { esAdmin } = require('../middleware/esAdmin');
// Controllers
const { registroAvanceTransaccion } = require('../controllers/transaccionController');
const { 
    getHome, 
    getTareas, 
    getStatus,
    postUsuario, 
    getUsuarios, 
    getUsuarioById,
    updateUsuarioById, 
    deleteUsuarioById, 
    getNotFound 
//} = require('../controllers/indexController');  Quitar comentario para prubas con client y verificar rutas
} = require('../controllers/controllerUsuarioSequelize');  //Comentar para prubas con client y verificar rutas
const { 
    getPerfilUsuarioById,
    postPerfil,
    updatePerfilByUsuarioId,
    deletePerfilByUsuarioId
 } = require('../controllers/controllerPerfilSequelize');  //No funcional para pruebas con client
const { getProyectosUsuarioById } = require('../controllers/controllerProyectoSequelize');  //No funcional para pruebas con client

// Rutas
router.get('/', getHome);
router.get('/Tareas', getTareas); 
router.get('/status', getStatus);
router.post('/login', loginUsuario);  //No ejecutar para pruebas con client

// Rutas para usuarios
router.post('/usuarios', validarCrearUsuario, postUsuario);
router.get('/usuarios', verificarToken, esAdmin, getUsuarios);
router.get('/usuarios/:id', validarId, verificarToken, getUsuarioById);
router.put('/usuarios/:id', validarId, verificarToken, validarActualizarUsuario, updateUsuarioById);
router.delete('/usuarios/:id', validarId, verificarToken, deleteUsuarioById);

//Rutas para perfiles
router.get('/usuarios/:id/perfil', validarId, verificarToken, getPerfilUsuarioById);  //No ejecutar para pruebas con client
router.post('/usuarios/:id/perfil', validarId, verificarToken, uploadFile(), postPerfil); //No ejecutar para pruebas con client
router.put('/usuarios/:id/perfil', validarId, verificarToken, updatePerfilByUsuarioId); //No ejecutar para pruebas con client
router.delete('/usuarios/:id/perfil', validarId, verificarToken, deletePerfilByUsuarioId); //No ejecutar para pruebas con client

// Rutas para proyectos
router.get('/usuarios/:id/proyectos', validarId, verificarToken, getProyectosUsuarioById); ///No ejecutar para pruebas con client

// Rutas para transacciones
router.post('/usuarios/:id/avance', validarId, verificarToken, registroAvanceTransaccion);

// Ruta no encontrada
router.use(getNotFound);

module.exports = router;