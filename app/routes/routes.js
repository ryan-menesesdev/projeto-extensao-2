const { listProducts } = require('../controllers/productController');

module.exports = {
    listProducts: (app) => {
        app.get('/products', (req, res) => {
            listProducts(app, req, res);
        });
    },
    error: (app) => {
        app.use((req, res, next) => {
            res.status(404).render('error.ejs');
        });
    }
}