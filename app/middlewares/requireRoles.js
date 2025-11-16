module.exports = (roles) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: 'error', code: 401, message: 'Usuário não autenticado.' });
        }

        const userType = req.user.tipo;
        if (!allowed.includes(userType)) {
            return res.status(403).json({ status: 'error', code: 403, message: 'Acesso negado. Permissão insuficiente.' });
        }
        next();
    };
};