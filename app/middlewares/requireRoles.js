module.exports = (roles) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    
    return (req, res, next) => {
        if (!req.user) {
            return res.redirect('/'); 
        }

        const userType = req.user.tipo;
        if (!allowed.includes(userType)) {

            console.log(req.user);
            console.log(`[Acesso Negado] Usuário ${req.user.email} (${userType}) tentou acessar rota restrita.`);
            
            return res.status(403).render('no-permission', {
                user: req.user
            });
        }

        next();
    };
};