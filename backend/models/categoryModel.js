const prisma = require('../config/db');

const categoryModel = {
    // Get all categories
    async findAll() {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    },

    // Get category by ID
    async findById(id) {
        return await prisma.category.findUnique({
            where: { id: parseInt(id) }
        });
    },

    // Create new category
    async create(categoryData) {
        return await prisma.category.create({
            data: {
                name: categoryData.name,
                description: categoryData.description
            }
        });
    },

    // Update category
    async update(id, categoryData) {
        return await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                name: categoryData.name,
                description: categoryData.description
            }
        });
    },

    // Delete category
    async delete(id) {
        await prisma.category.delete({
            where: { id: parseInt(id) }
        });
        return true;
    }
};

module.exports = categoryModel;
