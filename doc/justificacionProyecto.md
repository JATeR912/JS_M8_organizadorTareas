# Justificación Técnica del Proyecto

Este documento detalla las decisiones de arquitectura, fundamentos teóricos y decisiones de diseño implementadas en el desarrollo de la aplicación **Disper**.

---

## 1. Ecosistema Node.js y Entorno de Ejecución

La aplicación está construida sobre **Node.js**, aprovechando sus características principales para el desarrollo backend:

* **Entorno de ejecución asíncrono y no bloqueante:** Permite gestionar múltiples peticiones de manera eficiente en un solo hilo (single-thread) mediante el Event Loop.
* **Motor V8:** Compila y ejecuta JavaScript directamente a código máquina de alto rendimiento.
* **Arquitectura modular:** Facilita la separación de responsabilidades y la escalabilidad del código de cara a futuras entregas (integración de bases de datos, autenticación y operaciones CRUD).

---

## 2. Aporte de Express.js sobre Node.js Nativo

Aunque Node.js incluye el módulo nativo `http` para la creación de servidores, se incorporó **Express.js** como framework web por los siguientes motivos:

* **Enrutamiento simplificado:** Facilita la declaración y gestión clara de métodos HTTP (GET, POST, PUT, DELETE) y parámetros de URL.
* **Sistema de Middlewares:** Permite interceptar, procesar y auditar peticiones HTTP de forma modular (como el middleware de logger o el servicio de archivos estáticos).
* **Integración de Motores de Plantillas:** Proporciona una interfaz limpia para la renderización de vistas dinámicas utilizando Handlebars (`hbs`).
* **Manejo de respuestas HTTP:** Abstrae la configuración de cabeceras mediante métodos expresivos como `res.json()` y `res.status()`.

---

## 3. Esquema del Flujo Servidor – Cliente

El ciclo de vida de una petición HTTP en la aplicación sigue la siguiente secuencia:

<img width="995" height="283" alt="image" src="https://github.com/user-attachments/assets/c64d5577-2aba-4478-878e-b795f405b6a9" />

---

## 4. Estructura y Convenciones del Código

### Punto de Entrada (`index.js`)
Se utiliza `index.js` como punto de entrada principal por convención en el ecosistema de Node.js. Esto mantiene alineación directa con la propiedad `"main": "index.js"` definida en el archivo `package.json`, estableciendo un origen de ejecución claro y estandarizado.

### Integración de Controladores y Rutas
Se implementó el patrón de separación de rutas y controladores para desacoplar la definición de los endpoints de la lógica de negocio. Esta separación favorece la mantenibilidad, legibilidad y reutilización del código a medida que el proyecto incremente su complejidad en los siguientes módulos.

### Decisiones de Manejo de Datos (Alcance Entrega 1)
En esta primera etapa, la información se maneja mediante arreglos de datos en memoria (hardcoded) dentro de las funciones correspondientes. Aunque esto genera cierta repetición de constantes locales entre funciones, se optó por esta estrategia para garantizar el aislamiento de alcance (scope local), prevenir mutaciones no deseadas en el estado global y mantener la modularidad a la espera de la integración formal con bases de datos.


## Justificación referente a la base de datos

Se priorizan las conexiones mediante `Client` a la base de datos, ya que la cantidad de recursos consumidos de manera paralela para el proyecto no justifica el uso de `Pool` para la conexión.

Datos sensibles como usuario, contraseña y nombre de la base de datos se encuentran protegidos mediante el uso de un archivo `.env` y el módulo `dotenv`.

### Reutilización de código para la conexión con Client

Se añade una función auxiliar al archivo `config/db.js` que abstrae el flujo de conexión, consulta y cierre de `Client`. Esta función recibe la sentencia `sql` (o `query`, como se le denomina en la documentación oficial de `node-postgres` y en los ejemplos de clase) y el arreglo de parámetros `params` (o `values`).

Se define `params = []` como un arreglo vacío por defecto. Esto permite que la función sea universal: funciona tanto para consultas simples sin filtros (ej. `SELECT nombre FROM usuarios`) como para consultas parametrizadas con marcadores de posición (ej. `WHERE id = $1`), previniendo errores de `undefined` cuando no se envían valores.

```javascript
// Función reutilizable para realizar consultas a la base de datos mediante Client
async function ejecutarConsulta(sql, params = []) {
    if (!sql) {
        throw new Error('No se proporcionó una consulta SQL válida');
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Conexión a PostgreSQL con client correcta');
        const resultado = await client.query(sql, params);
        return resultado.rows;
    } catch (err) {
        console.error('Error al ejecutar consulta:', err.message);
        throw err;
    } finally {
        await client.end();
        console.log('Conexión client cerrada');
    }
}
```

#### Referencias técnicas y alineación con código de clase

1. **Documentación de `node-postgres`:** La librería expone la firma `client.query(text, values)` para ejecutar peticiones. El helper mapea directamente el argumento `sql` a `text` y `params` a `values`.
2. **Coherencia con controladores:** En los ejemplos vistos en clase se acostumbra a separar la sentencia y los datos ingresados por el cliente antes de la ejecución:

```javascript
const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id';
const values = [id];
// El helper permite llamar esto de forma limpia:
// await ejecutarConsulta(query, values);
```

### Validacion de datos previo a modificacion en DB

Para actualizar datos del usuario que contienen `id`, `nombre`, `email`, `password`, `fecha_registro` y `activo`, se limitan las modificaciones únicamente a `nombre` y/o `email`. La `fecha_registro` y `activo` son de gestión automática del sistema o no requieren ser actualizados directamente por el usuario. Por motivos de seguridad, la `password` tampoco se actualiza desde la misma ruta de información general.

Respecto a la validación de datos se aplicó lo siguiente:
- **id:** Se valida que sea ingresado en los parámetros de la URL, que sea un número entero y que no sea negativo.
- **nombre:** Se valida que no esté vacío, se limpian espacios al inicio/final con `.trim()` y se exige un mínimo de 3 caracteres.
- **email:** Se valida que no esté vacío, se limpian espacios al inicio/final y se verifica el formato estándar mediante expresiones regulares (regex).

### Manejo de errores y auditoría mediante logs
Para garantizar la trazabilidad del sistema, se implementa un mecanismo centralizado de auditoría y monitoreo. A través de loggerMiddleware, se registran automáticamente todas las peticiones entrantes en consola y archivo. De forma complementaria, la función registrarErrorLog captura y almacena de manera estructurada las excepciones no controladas y los fallos de la base de datos en logs/log.txt, permitiendo un diagnóstico rápido sin exponer detalles internos al cliente en la respuesta HTTP.

### Comparación de resultados entre SQL manual y ORM.

- **Reducción de código y expresividad:** Permite trabajar de forma homogénea en JavaScript sin necesidad de escribir cadenas de texto SQL manualmente. Operaciones complejas de lectura como `'SELECT id, nombre, email, fecha_registro, activo FROM usuarios WHERE id = $1';` se abstraen de forma limpia a métodos nativos del ORM como `Usuario.findByPk(id)`.

- **Seguridad integrada:** Al utilizar los métodos del ORM, las consultas se sanitizan automáticamente, reduciendo drásticamente el riesgo de vulnerabilidades por SQL Injection sin tener que preocuparse por la parametrización manual constante.

- **Agilidad en el modelado de datos:** Facilita la creación, modificación y mantenimiento del esquema de la base de datos. Durante la etapa de desarrollo (donde no hay datos sensibles), opciones como { force: true } o { alter: true } permiten sincronizar cambios en los modelos de forma inmediata sin tener que ejecutar scripts de migración manuales en PostgreSQL.

- **Validaciones centralizadas en la capa de datos:** Permite definir reglas de negocio e integridad diretamente en la declaración del modelo (por ejemplo, restricciones de unicidad, expresiones regulares o tipos de datos). Esto garantiza que cualquier registro invalido sea rechazado antes de ser persistido en la base de datos.

- **Manejo de respuestas y proyección de atributos:** En SQL nativo, la recuperación de registros recién insertados o actualizados requiere el uso explícito de la cláusula `RETURNING *`, además de listar manualmente cada columna en las sentencias `SELECT` si se desea limitar la respuesta. El ORM automatiza el retorno de las instancias persistidas y facilita la selección o exclusión explícita de campos mediante la propiedad attributes, simplificando la sanitización de datos sensibles como contraseñas o estados internos.

### Referencias y Documentación
* **Documentación Oficial Node Postgres (`pg.Client`):** https://node-postgres.com/apis/client