// middleware/authMiddleware.js

/**
 * requireStoreAuth — protege rutas del panel admin de tienda
 */
const requireStoreAuth = (req, res, next) => {
  // Validamos si existe el objeto 'store' en la sesión
  if (req.session && req.session.store) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/store/login');
};

/**
 * requireUserAuth — protege rutas del dashboard de usuario
 */
const requireUserAuth = (req, res, next) => {
  // Validamos si existe el objeto 'user' en la sesión
  if (req.session && req.session.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/user/login');
};

/**
 * attachLocals — adjunta store/user y carrito a res.locals para que estén disponibles en TODAS las vistas EJS
 */
const attachLocals = (req, res, next) => {
  res.locals.storeSession = req.session.store || null;
  res.locals.userSession  = req.session.user  || null;
  
  // Seguridad para el Navbar: si no existe el carrito en la sesión, ponemos 0
  res.locals.cartItemCount = req.session.cart ? req.session.cart.length : 0;
  
  next();
};

module.exports = { requireStoreAuth, requireUserAuth, attachLocals };