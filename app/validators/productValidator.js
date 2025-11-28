const productSchema = require('./schemas/productSchema');

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    
    if(error) {
        const errorMap = {};
        error.details.forEach(detail => {
            errorMap[detail.path[0]] = detail.message;
        });

        return res.render('admin/add-product', { 
            errors: errorMap, 
            formData: req.body 
        });
    }
    
    next();
};

const validateProductUpdate = (req, res, next) => {
    const { error } = productSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    
    if(error) {
        const errorMap = {};
        error.details.forEach(detail => {
            errorMap[detail.path[0]] = detail.message;
        });

        const productData = {
            ...req.body,
            id: req.params.id 
        };

        return res.render('admin/edit-product', { 
            errors: errorMap, 
            product: productData, 
            formData: req.body    
        });
    }
    
    next();
};

module.exports = { validateProduct, validateProductUpdate };