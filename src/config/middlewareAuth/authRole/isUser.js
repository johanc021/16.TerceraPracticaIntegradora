const isUser = (req, res, next) => {
    /* console.log('req.isAuthenticated():', req.isAuthenticated());
    console.log('req.user:', req.user); */

    // Verifica si el usuario está autenticado y es un user+
    if (req.isAuthenticated() && req.user && req.user.role === 'user') {
        // Si el usuario es un administrador, permite el acceso
        return next();
    }
    res.status(403).json({ error: 'Acceso no autorizado' });
};

export default isUser






