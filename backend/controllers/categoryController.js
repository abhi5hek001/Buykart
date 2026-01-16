const categoryService = require('../services/categoryService');

const categoryController = {
    // GET /api/categories
    async getAll(req, res, next) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json({ success: true, data: categories });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/categories/:id
    async getById(req, res, next) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            res.json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/categories
    async create(req, res, next) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/categories/:id
    async update(req, res, next) {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            res.json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/categories/:id
    async delete(req, res, next) {
        try {
            const result = await categoryService.deleteCategory(req.params.id);
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = categoryController;
