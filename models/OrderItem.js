// models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  // Precio al momento de la compra (snapshot)
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  // Agregado correctamente dentro del objeto del modelo
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permite null para órdenes antiguas
    field: 'store_id',
    references: { 
      model: 'stores', 
      key: 'id' 
    }
  }
});

module.exports = OrderItem;