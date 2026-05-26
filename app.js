// app.js
require('dotenv').config();
const express      = require('express');
const path         = require('path');
const session      = require('express-session');
const cookieParser = require('cookie-parser');
const ejsLayouts   = require('express-ejs-layouts');
const sequelize    = require('./config/database');
const { Product, Order, OrderItem } = require('./models');

// === IMPORTS DE RUTAS ===
const productRoutes   = require('./routes/products');
const cartRoutes      = require('./routes/cart');
const checkoutRoutes  = require('./routes/checkout');
const storeAuthRoutes = require('./routes/storeAuth');
const userAuthRoutes  = require('./routes/userAuth');
const storeAdminRoutes = require('./routes/storeAdmin');
const customerRoutes  = require('./routes/customer');

// === IMPORTS DE MIDDLEWARES ===
const { attachLocals } = require('./middleware/authMiddleware');

const app  = express();
const port = process.env.PORT || 3000;

// === CONFIGURACIÓN DE VISTAS (EJS) ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');        // Usa views/layout.ejs como plantilla base
app.use(ejsLayouts);                // Activa el sistema de layouts

// === MIDDLEWARES GENERALES ===
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(session({
  secret:            process.env.SESSION_SECRET || 'dev-secret',
  resave:            false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

// Adjuntar locals de autenticación después de la sesión
app.use(attachLocals);

// Middleware: Carrito vacío en sesión si no existe
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = { items: [], totalQty: 0, totalPrice: 0 };
  }
  res.locals.cartItemCount = req.session.cart.totalQty || 0;
  next();
});

// Middleware para desactivar el layout base en vistas de auth y paneles dinámicos
app.use([
    '/store/login', '/store/register',
    '/user/login',  '/user/register',
    '/store-admin', '/customer'
  ],
  (req, res, next) => { 
    res.locals.layout = false; 
    next(); 
  }
);

// === ENRUTAMIENTO (ROUTES) ===
app.use('/',            productRoutes);
app.use('/cart',        cartRoutes);
app.use('/checkout',    checkoutRoutes);
app.use('/store',       storeAuthRoutes);
  app.use('/user',        userAuthRoutes);
app.use('/store-admin', storeAdminRoutes);
app.use('/customer',    customerRoutes);

// Manejo de error 404 (Debe ir al final de las rutas de arriba)
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// === SINCRONIZACIÓN DE BASE DE DATOS Y ARRANQUE ===
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada correctamente.');
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto: ${port}`);
    });
  })
  .catch(err => {
    console.error('Error crítico al sincronizar BD:', err.message);
    process.exit(1);
  });