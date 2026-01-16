const categoryModel = require('../models/categoryModel');

const categoryService = {
    async getAllCategories() {
        return await categoryModel.findAll();
    },

    async getCategoryById(id) {
        const category = await categoryModel.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    },

    async createCategory(data) {
        if (!data.name) {
            throw new Error('Category name is required');
        }
        return await categoryModel.create(data);
    },

    async updateCategory(id, data) {
        const category = await categoryModel.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return await categoryModel.update(id, data);
    },

    async deleteCategory(id) {
        const deleted = await categoryModel.delete(id);
        if (!deleted) {
            throw new Error('Category not found');
        }
        return { message: 'Category deleted successfully' };
    }
};

module.exports = categoryService;
