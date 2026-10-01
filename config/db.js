require('dotenv').config()
const {Client} = require('pg')
const { Sequelize } = require('sequelize');

async function probarConexionClient(consulta){
    const client = new Client({
    connectionString: process.env.DATABASE_URL,
    });

    try{
        await client.connect();
        console.log('Conexion a postgreSQL con client correcta');
        consulta && (await client.query(consulta));
    }catch(err){
        console.error('Error al conectar con client:', err.message);
    }finally{
        await client.end();
        console.log('Conexion client cerrada');
    }
};


//Funcion reutilizable para realizar consultas a la base de datos mediante Client
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
};

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD,
  {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false
});

module.exports = {probarConexionClient, ejecutarConsulta, sequelize};