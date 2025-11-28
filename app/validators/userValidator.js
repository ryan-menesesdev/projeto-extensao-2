const userSchema = require('./schemas/userSchema');
const userUpdateSchema = require('./schemas/userUpdateSchema');

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    
    if(error) {
        const errorMap = {};
        error.details.forEach(detail => {
            errorMap[detail.path[0]] = detail.message;
        });

        return res.render('admin/add-user', { 
            errors: errorMap, 
            formData: req.body 
        });
    }
    
    next();
};

const validateUserUpdate = (req, res, next) => {
    const { error } = userUpdateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    
    if(error) {
        const errorMap = {};
        error.details.forEach(detail => {
            errorMap[detail.path[0]] = detail.message;
        });

        const userData = {
            ...req.body,
            id: req.params.id 
        };
        
        return res.render('admin/edit-user', { 
            errors: errorMap, 
            user: userData,    
            formData: req.body 
        });
    }
    
    next();
};

module.exports = { validateUser, validateUserUpdate };