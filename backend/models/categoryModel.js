const prisma = require('../config/db');
const { generateId } = require('../utils/idGenerator');

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
            where: { id }
        });
    },

    // Create new category
    async create(categoryData) {
        return await prisma.category.create({
            data: {
                id: generateId('CAT'),
                name: categoryData.name,
                description: categoryData.description
            }
        });
    },

    // Update category
    async update(id, categoryData) {
        return await prisma.category.update({
            where: { id },
            data: {
                name: categoryData.name,
                description: categoryData.description
            }
        });
    },

    // Delete category
    async delete(id) {
        await prisma.category.delete({
            where: { id }
        });
        return true;
    }
};

module.exports = categoryModel;
