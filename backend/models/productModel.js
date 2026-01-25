const prisma = require('../config/db');
const { generateId } = require('../utils/idGenerator');

const productModel = {
    // Get all products with optional search and category filter
    async findAll(filters = {}) {
        const where = {};

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { description: { contains: filters.search } }
            ];
        }

        // Support filtering by Category ID or Name
        if (filters.category) {
            where.category = {
                OR: [
                    { id: filters.category },
                    { name: filters.category }
                ]
            };
        }

        return await prisma.product.findMany({
            where,
            include: {
                category: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    // Get product by ID
    async findById(id) {
        return await prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    select: { name: true }
                }
            }
        });
    },

    // Create new product
    async create(productData) {
        const product = await prisma.product.create({
            data: {
                id: generateId('PRD'),
                name: productData.name,
                description: productData.description,
                price: productData.price,
                stock: productData.stock || 0,
                imageUrl: productData.image_url,
                categoryId: productData.category_id || null
            },
            include: {
                category: {
                    select: { name: true }
                }
            }
        });
        return product;
    },

    // Update product
    async update(id, productData) {
        return await prisma.product.update({
            where: { id },
            data: {
                name: productData.name,
                description: productData.description,
                price: productData.price,
                stock: productData.stock,
                imageUrl: productData.image_url,
                categoryId: productData.category_id || null
            },
            include: {
                category: {
                    select: { name: true }
                }
            }
        });
    },

    // Delete product
    async delete(id) {
        try {
            await prisma.product.delete({
                where: { id }
            });
            return true;
        } catch (e) {
            return false;
        }
    },

    // Update stock (for transactions)
    async updateStock(id, quantity, tx = null) {
        const db = tx || prisma;
        await db.product.update({
            where: { id },
            data: {
                stock: { decrement: quantity }
            }
        });
    },

    // Check stock availability
    async checkStock(id, quantity) {
        const product = await prisma.product.findUnique({
            where: { id },
            select: { stock: true }
        });
        return product && product.stock >= quantity;
    }
};

module.exports = productModel;
