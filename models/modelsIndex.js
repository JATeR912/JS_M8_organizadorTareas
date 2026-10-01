const {Usuario} = require('./usuario');
const {Perfil} = require('./perfil');
const {Proyecto} = require('./proyecto');
const {Tarea} = require('./tarea');
const {LogAvance} = require('./logAvance');

//Relacion 1:1 entre Usuario y Perfil
Usuario.hasOne(Perfil, {foreignKey: 'usuario_id', as: 'perfil', onDelete: 'CASCADE'});
Perfil.belongsTo(Usuario, {foreignKey: 'usuario_id', as: 'usuario'});

//Relacion 1:N entre Usuario y Proyecto
Usuario.hasMany(Proyecto, {foreignKey: 'usuario_id', as: 'proyectos', onDelete: 'CASCADE'});
Proyecto.belongsTo(Usuario, {foreignKey: 'usuario_id', as: 'usuario'});

//Relacion 1:N entre Proyecto y Tarea
Proyecto.hasMany(Tarea, {foreignKey: 'proyecto_id', as: 'tareas', onDelete: 'CASCADE'});
Tarea.belongsTo(Proyecto, {foreignKey: 'proyecto_id', as: 'proyecto'});

//Relacion M:N entre Usuario y Tarea mediante LogAvance
Tarea.belongsToMany(Usuario, { through: LogAvance, foreignKey: 'tarea_id', otherKey: 'usuario_id', as: 'usuarios', onDelete: 'CASCADE' });
Usuario.belongsToMany(Tarea, { through: LogAvance, foreignKey: 'usuario_id', otherKey: 'tarea_id', as: 'tareas', onDelete: 'CASCADE' });

module.exports = {
    Usuario,
    Perfil,
    Proyecto,
    Tarea,
    LogAvance
};
