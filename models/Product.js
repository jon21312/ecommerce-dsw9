// models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  stock: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  imageUrl: { 
    type: DataTypes.STRING 
  },
  // Metimos storeId dentro del objeto del modelo
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'store_id', // Nombre exacto de la columna en la base de datos
    references: { 
      model: 'stores', // Debe coincidir con el nombre de la tabla de tiendas
      key: 'id' 
    }
  }
});

module.exports = Product;



;
