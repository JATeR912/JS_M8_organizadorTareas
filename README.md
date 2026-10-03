# Disper - Organizador de Tareas

Proyecto desarrollado para los Módulos 6, 7 y 8 del programa Talento Digital 2026.

## Descripción del Proyecto

El presente proyecto corresponde al desarrollo progresivo de una aplicación web para la gestión y organización de tareas mediante operaciones CRUD y persistencia de datos mediante PostgreSQL y Sequelize ORM. Actualmente contempla la gestión relacional de usuarios, perfiles, proyectos y tareas, autenticación con JWT y manejo de roles actualmente centrado en usuario y administrador, subida de archivos de imagen y estandarización de API RESTful.


## Arquitectura Utilizada

El sistema está construido bajo una arquitectura modular, separando responsabilidades mediante modelos, controladores, enrutadores y middlewares.

* **Backend:** Node.js, Express.js.
* **Base de Datos & ORM:** PostgreSQL, Sequelize ORM, Driver nativo `pg` (node-postgres) y `pg-hstore`.
* **Motor de Plantillas:** Handlebars (`hbs`) con uso de layouts y partials dinámicos.
* **Frontend:** HTML5, CSS3, Bootstrap 5.3.
* **Herramientas de Desarrollo:** Git, GitHub, Visual Studio Code, Thunder Client, Dotenv.

## Estructura del Proyecto
```bash
/
├── config/
│   └── db.js                           # Configuración de conexiones PostgreSQL y Sequelize
│   └── schema.sql                      # Script de consultas SQL nativas
├── controllers/
│   ├── indexController.js              # Controlador nativo con pg.Client
│   ├── controllerUsuarioSequelize.js   # Controlador usuarios con ORM Sequelize
│   ├── controllerPerfilSequelize.js    # Controlador perfiles con ORM Sequelize
│   ├── controllerProyectoSequelize.js  # Controlador proyectos con ORM Sequelize
│   ├── controllerLoginSequelize.js     # Controlador login para inicio de sesion y token con JWT
│   └── transaccionController.js        # Controlador transaccion con pg.Client
├── doc/
│   └── justificacionProyecto.md        # Justificación técnica y teórica completa (M6, M7 y M8)
├── logs/
│   └── log.txt                         # Registro de auditoría y errores del servidor
├── middleware/
│   ├── esAdmin.js                      # Verifica el rol del usuario
│   ├── logger.js                       # Registrar logs en archivo y consola
│   ├── uploadFile.js                   # Validaciones subida de archivos de imagen
│   ├── validarId.js                    # Validación de parámetros ID de ruta
│   ├── validarUsuario.js               # Validaciones de entrada para creación/edición
│   └── verificarToken.js               # Verificar token
├── models/
│   ├── usuario.js                      # Modelo Sequelize de Usuario
│   ├── perfil.js                       # Modelo Sequelize de Perfil
│   ├── proyecto.js                     # Modelo Sequelize de Proyecto
│   ├── tarea.js                        # Modelo Sequelize de Tarea
│   ├── logAvance.js                    # Modelo Sequelize de LogAvance (Tabla intermedia)
│   └── modelsIndex.js                  # Centralizador y definición de relaciones ORM
├── public/
│   ├── css/
│   │    └── style.css                  # Estilos CSS de la aplicación
│   └── uploads                         # Carpeta para subida de archivos
├── routes/
│   └── router.js                       # Definición de las rutas del sistema
├── views/
│   ├── partials/                       # Componentes reutilizables de Handlebars
│   │   ├── footer.hbs
│   │   └── nav.hbs
│   ├── 404.hbs                         # Vista para error de ruta no encontrada
│   ├── home.hbs                        # Vista de la página de inicio
│   └── tareas.hbs                      # Vista del listado de tareas
├── .env                                # Variables de entorno (puerto, configuraciones)
├── .env.example                        # Plantilla de ejemplo para variables de entorno
├── .gitignore                          # Archivos omitidos por Git (como node_modules)
├── index.js                            # Punto de entrada principal del servidor Express
├── package-lock.json                   # Árbol de dependencias exactas
├── package.json                        # Configuración del proyecto, dependencias y scripts
└── README.md                           # Documentación principal del proyecto  
```
## Requisitos e Instalación

### Requisitos previos
Asegúrate de tener instalados en tu sistema:
* Node.js (versión >= 18.0.0 LTS recomendada).
* npm (versión >= 9.0.0).
* Git (para clonar el repositorio).

### Pasos para la instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/JATeR912/JS_M6_M7_M8_organizadorTareas
cd JS_M6_M7_M8_organizadorTareas
```

2. Instalar dependencias del proyecto:
Ejecuta el siguiente comando para instalar las librerías necesarias definidas en el package.json:
```bash
npm install
```
3. Herramienta de desarrollo (Nodemon):
**(Opcional: nodemon está guardado en devDependencies, se instalará automáticamente con npm install).**

El script de desarrollo utiliza nodemon. Si deseas instalarlo globalmente en tu equipo, puedes hacerlo ejecutando:
```bash
npm install -g nodemon
```

> **Nota de instalación y configuración:** 
> * **Base de Datos Inicial:** Para poblar PostgreSQL con datos iniciales vía SQL nativo, se puede ejecutar el script config/schema.sql.
> * **Sincronización con Sequelize:** Si se requiere que Sequelize genere o actualice las tablas de forma automática desde los modelos, asegurarse de activar la línea await sequelize.sync({ alter: true }) en index.js.
> * **Alternancia de Persistencia (Client / Sequelize):** El código cuenta con bloques comentados en index.js y routes/router.js que permiten alternar fácilmente la ejecución entre consultas con cliente SQL nativo (pg) y el ORM Sequelize para pruebas de rendimiento o verificación.

## Ejecución y Scripts

El archivo package.json incluye los siguientes scripts para levantar el servidor:

* Servidor en desarrollo (con recarga automática mediante nodemon):
```bash
npm run dev
```
* Servidor en producción:
```bash
npm start
```
* Ejecución directa sin scripts:
```bash
node index.js
```

### Autenticación e Instrucciones de Prueba

Para probar las rutas protegidas mediante JWT en Thunder Client o Postman:

1. **Obtención del Token (POST /login):**
   Envía una petición POST a `http://localhost:3000/login` en formato JSON con las credenciales de cualquier usuario registrado:
   ```json
   Por ejemplo:
   {
     "email": "jose.gonzalez@mail.com",
     "password": "contrasena1234"
   }
   ```
   El servidor responderá con status 200 OK y entregará el token firmado en la respuesta JSON.

2. **Uso del Token en Rutas Protegidas:**
   Copia el token generado e ingrésalo en la pestaña Auth eligiendo el tipo Bearer Token para probar los endpoints privados (ej: GET /usuarios/:id).

> **Nota importante sobre Pruebas de Rol Admin (GET /usuarios):**
> * Por defecto, la creación de usuarios en Sequelize les asigna el rol 'user'.
> * La ruta GET /usuarios requiere estrictamente el rol 'admin' (retornará 403 Forbidden a usuarios estándar).
> * Si deseas probar el acceso de Administrador en este endpoint, debes actualizar el rol de tu usuario directamente en PostgreSQL ejecutando la consulta incluida al final del archivo `config/schema.sql`:
>   
>   ```sql
>   UPDATE "Usuarios" SET rol = 'admin' WHERE email = 'jose.gonzalez@mail.com';
>   ```
>   
> * Una vez actualizado el registro en la base de datos, vuelve a realizar el POST /login para obtener un token nuevo que incluya las credenciales de administrador en su payload.

### Configuración del Puerto (.env)

El servidor admite la configuración de variables de entorno mediante un archivo .env(se recomienda usar ambas versiones en paralelo). Si no se define la variable PORT, el sistema tomará por defecto el puerto 3000.

Crea un archivo .env en la raíz del proyecto (puedes guiarte con .env.example):

```env
PORT=3000

DATABASE_URL=postgresql://usuarioDB:contraseñaDB@localhost:5432/nombreDB

DB_NAME=nombreDB
DB_USER=usuarioDB
DB_PASSWORD=contraseñaDB
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=clave_secreta_super_secreta
```
Una vez ejecutado el comando de inicio, accede desde tu navegador a:
http://localhost:3000/ (o utilizando el puerto configurado en tu archivo .env: http://localhost:PORT/).

## Endpoints y Rutas del Sistema

### 1. Autenticación y Rutas Públicas
| Método | Ruta | Descripción | Middleware / Control |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Vista/Respuesta principal. | `getHome` |
| **GET** | `/Tareas` | Consulta lista general de tareas (datos de prueba). | `getTareas` |
| **GET** | `/status` | Estado del servidor. | `getStatus` |
| **POST** | `/login` | Inicia sesión y retorna un token JWT firmado. | `loginUsuario` |

### 2. Gestión de Usuarios (CRUD)
| Método | Ruta | Descripción | Middleware / Control |
| :--- | :--- | :--- | :--- |
| **POST** | `/usuarios` | Registra un nuevo usuario en la base de datos. | `validarCrearUsuario`, `postUsuario` |
| **GET** | `/usuarios` | Obtiene el listado completo de usuarios (solo Administrador). | `verificarToken`, `esAdmin`, `getUsuarios` |
| **GET** | `/usuarios/:id` | Obtiene la información de un usuario específico. | `validarId`, `verificarToken`, `getUsuarioById` |
| **PUT** | `/usuarios/:id` | Actualiza campos permitidos (`nombre`, `email`) de un usuario. | `validarId`, `verificarToken`, `validarActualizarUsuario`, `updateUsuarioById` |
| **DELETE** | `/usuarios/:id` | Elimina un usuario existente por su ID. | `validarId`, `verificarToken`, `deleteUsuarioById` |

### 3. Gestión de Perfiles (CRUD Relacional 1:1 y Subida de Archivos)
| Método | Ruta | Descripción | Middleware / Control |
| :--- | :--- | :--- | :--- |
| **GET** | `/usuarios/:id/perfil` | Consulta el perfil asociado a un usuario. | `validarId`, `verificarToken`, `getPerfilUsuarioById` |
| **POST** | `/usuarios/:id/perfil` | Crea un nuevo perfil e incrementa el archivo avatar con Multer. | `validarId`, `verificarToken`, `uploadFile()`, `postPerfil` |
| **PUT** | `/usuarios/:id/perfil` | Actualiza campos del perfil (`avatar_url`, `telefono`, `sobre_mi`). | `validarId`, `verificarToken`, `updatePerfilByUsuarioId` |
| **DELETE** | `/usuarios/:id/perfil` | Elimina el perfil de un usuario. | `validarId`, `verificarToken`, `deletePerfilByUsuarioId` |

### 4. Gestión de Proyectos (CRUD Relacional 1:N y Subida de Archivos)
| Método | Ruta | Descripción | Middleware / Control |
| :--- | :--- | :--- | :--- |
| **GET** | `/usuarios/:id/proyectos` | Consulta los proyectos vinculados al usuario. | `validarId`, `verificarToken`, `getProyectosUsuarioById` |
| **POST** | `/usuarios/:id/proyectos` | Crea un nuevo proyecto e incluye imagen mediante Multer. | `validarId`, `verificarToken`, `uploadFile()`, `postProyecto` |
| **PUT** | `/usuarios/:id/proyectos/:proyecto_id` | Actualiza campos del proyecto (`titulo`, `descripcion`, `privado`). | `validarId`, `verificarToken`, `updateProyectoByUsuarioId` |
| **DELETE** | `/usuarios/:id/proyectos/:proyecto_id` | Elimina un proyecto específico perteneciente al usuario. | `validarId`, `verificarToken`, `deleteProyectoByUsuarioId` |

### 5. Consultas y Transacciones SQL
| Método | Ruta | Descripción | Middleware / Control |
| :--- | :--- | :--- | :--- |
| **POST** | `/usuarios/:id/avance` | Registra avance de tarea con transacción nativa (`Client`). | `validarId`, `verificarToken`, `registroAvanceTransaccion` |

### 6. Control de Errores
| Método | Ruta | Descripción | Respuesta |
| :--- | :--- | :--- | :--- |
| **ALL** | `*` | Captura de cualquier ruta no definida. | `getNotFound` (Vista 404 con HBS)|

<img width="1918" height="966" alt="image" src="https://github.com/user-attachments/assets/3b848dc2-1587-425d-a8f7-b57a2b9ee931" />


### Respuesta del Endpoint 
**/status**
El endpoint /status retorna una respuesta en formato JSON con la siguiente estructura:

<img width="616" height="322" alt="image" src="https://github.com/user-attachments/assets/3fa586e5-e377-45a7-b109-17fa0168e8c1" />

**/usuarios/:id/perfil**
El endpoint /usuarios/:id/perfil retorna repuesta en formato JSON con el perfil asociado a un usuario, limitando los datos de usuario, para evitar el envío de contraseñas.

<img width="1491" height="872" alt="sequelize_get_usuarios_perfil_ok_true" src="https://github.com/user-attachments/assets/6641a823-3e83-4a54-8b22-9932b95083da" />

**/usuarios/:id/proyectos**
El endpoint /usuarios/:id/proyectos retorna repuesta en formato JSON con los proyectos asociados a un usuario, limitando los datos de usuario, para evitar el envío de contraseñas.

<img width="1548" height="886" alt="sequelize_get_usuarios_proyectos_ok_true" src="https://github.com/user-attachments/assets/4c3d46a9-a17a-43e4-a6bd-16c8e5589cd2" />

### Uso de Inteligencia Artificial (IA)

El proyecto presenta uso de IA principalmente, para corrección y redaccion de textos, validaciones (regex) y organización de paso a paso durante el proceso de trabajo.

**Para consultar la teoría detallada y justificaciones técnicas del módulo, revisa el archivo [doc/justificacionProyecto.md](./doc/justificacionProyecto.md).**

