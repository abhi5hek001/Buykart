const productService = require('../services/productService');

const productController = {
    // GET /api/products
    async getAll(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                category: req.query.category
            };
            const products = await productService.getAllProducts(filters);
            res.json({ success: true, data: products });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/products/:id
    async getById(req, res, next) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/products
    async create(req, res, next) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/products/:id
    async update(req, res, next) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/products/:id
    async delete(req, res, next) {
        try {
            const result = await productService.deleteProduct(req.params.id);
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = productController;
