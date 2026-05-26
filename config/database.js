// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuración SSL básica para producción (Aiven)
const sslOptions = process.env.NODE_ENV === 'production' 
  ? { ssl: { rejectUnauthorized: false } } // Esto salta la verificación estricta del archivo .pem en Render
  : {}; // En local sin SSL si tu MySQL no lo pide, o déjalo según uses

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:           process.env.DB_HOST,
    port:           parseInt(process.env.DB_PORT) || 3306,
    dialect:        'mysql',
    logging:        false,
    dialectOptions: sslOptions
  }
);

sequelize.authenticate()
  .then(() => console.log('Conexion a MySQL establecida con éxito.'))
  .catch(err => {
    console.error('Error crítico conectando a la base de datos:', err.message);
    process.exit(1); // Esto ayuda a ver el error claro en los logs si falla
  });

module.exports = sequelize;