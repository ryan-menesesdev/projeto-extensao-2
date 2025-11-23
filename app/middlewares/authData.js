const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token =
        (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null) ||
        (req.cookies && req.cookies.authToken);

    if (!token) {
        req.user = null;
        res.locals.user = null;
        res.locals.isAuthenticated = false;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.user = null;
            res.locals.user = null;
            res.locals.isAuthenticated = false;
            return next();
        }

        req.user = decoded;
        res.locals.user = decoded;
        res.locals.isAuthenticated = true;
        next();
    });
};