export const policyRoles = (roles) => {
    return (req, res, next) => {
        const role = req.user.role; // Aquí asumo que el rol se envía como un parámetro de la URL

        if (!role) {
            return res.status(400).json({ status: "error", error: "No se proporcionaron roles permitidos" });
        }

        if (roles.includes(role)) {
            return next();
        } else {
            return res.status(403).json({ status: "error", error: "No está autorizado" });
        }
    };
};

/* export const isAdmin = (req, res, next) => {
    console.log('req.isAuthenticated():', req.isAuthenticated());
    console.log('req.user:', req.user);

    // Verifica si el usuario está autenticado y es un administrador
    if (req.isAuthenticated() && req.user && req.user.role === 'admin' || 'premium') {
        // Si el usuario es un administrador, permite el acceso
        return next();
    }
    res.status(403).json({ error: 'Acceso no autorizado' });
}; */








