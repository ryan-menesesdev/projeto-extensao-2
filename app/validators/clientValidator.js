const registerSchema = require('./schemas/registerSchema');
const loginSchema = require('./schemas/loginSchema');

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    
    if(error) {
        const errorMap = {};
        error.details.forEach(detail => {
            errorMap[detail.path[0]] = detail.message;
        });

        return res.render('register', { 
            errors: errorMap, 
            formData: req.body 
        });
    }
    
    next();
};

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    
    if(error) {
        const errorMap = {};
        error.details.forEach(detail => {
            errorMap[detail.path[0]] = detail.message;
        });

        return res.render('login', { 
            errors: errorMap, 
            formData: req.body 
        });
    }
    
    next();
};

module.exports = { validateRegister, validateLogin };