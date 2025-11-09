// Criar Header com key 'x-dev-role' e valor com 'funcionario' ou 'supervisor' para simular validação
module.exports = function devAuth(req, res, next) {
    const role = req.headers['x-dev-role'] || req.query.asRole;
    if (role) {
        req.user = { id: 1, role: role };
    }
    next();
};