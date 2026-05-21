// models/index.js
const sequelize = require('../config/database');
const Product   = require('./Product');
const Order     = require('./Order');
const OrderItem = require('./OrderItem');
const Store     = require('./Store');
const User      = require('./User');
const Wishlist  = require('./Wishlist');

// ==========================================
// RELACIONES
// ==========================================

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product <-> OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Store <-> Product
Store.hasMany(Product, { foreignKey: 'store_id', as: 'products' });
Product.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// Store <-> OrderItem (Para segmentar ventas por tienda fácilmente)
Store.hasMany(OrderItem, { foreignKey: 'store_id', as: 'orderItems' });
OrderItem.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Product (Muchos a Muchos mediante Wishlist)
User.belongsToMany(Product, { 
  through: Wishlist, 
  foreignKey: 'user_id', 
  otherKey: 'product_id', 
  as: 'wishlistProducts' 
});
Product.belongsToMany(User, { 
  through: Wishlist, 
  foreignKey: 'product_id', 
  otherKey: 'user_id', 
  as: 'wishedByUsers' 
});

// Relaciones directas con el modelo intermedio (Wishlist) para consultas específicas
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ==========================================
// SINCRONIZACIÓN DE LA BASE DE DATOS
// ==========================================
sequelize.sync({ alter: true })
  .then(() => console.log('✓ Tablas e índices sincronizados correctamente.'))
  .catch(err => console.error('✗ Error en la sincronización:', err));

// Exportación unificada de todos los modelos
module.exports = { Product, Order, OrderItem, Store, User, Wishlist };