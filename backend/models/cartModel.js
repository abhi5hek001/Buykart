const prisma = require('../config/db');
const { generateId } = require('../utils/idGenerator');

const cartModel = {
    // Get cart items for a user
    async findByUser(userId) {
        const items = await prisma.cart.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        name: true,
                        price: true,
                        imageUrl: true,
                        stock: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Add subtotal calculation
        return items.map(item => ({
            ...item,
            product_name: item.product.name,
            price: item.product.price,
            image_url: item.product.imageUrl,
            stock: item.product.stock,
            subtotal: Number(item.product.price) * item.quantity
        }));
    },

    // Get cart total
    async getCartTotal(userId) {
        const items = await prisma.cart.findMany({
            where: { userId },
            include: {
                product: {
                    select: { price: true }
                }
            }
        });

        const total = items.reduce((sum, item) =>
            sum + Number(item.product.price) * item.quantity, 0);

        return {
            total: total,
            item_count: items.length
        };
    },

    // Add item to cart (or update quantity if exists)
    async addItem(userId, productId, quantity = 1) {
        const existing = await prisma.cart.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });

        if (existing) {
            await prisma.cart.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + quantity }
            });
        } else {
            await prisma.cart.create({
                data: {
                    id: generateId('CRT'),
                    userId,
                    productId,
                    quantity
                }
            });
        }
        return this.findByUser(userId);
    },

    // Update item quantity
    async updateQuantity(userId, productId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(userId, productId);
        }
        await prisma.cart.update({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            data: { quantity }
        });
        return this.findByUser(userId);
    },

    // Remove item from cart
    async removeItem(userId, productId) {
        await prisma.cart.delete({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });
        return this.findByUser(userId);
    },

    // Clear cart for user
    async clearCart(userId) {
        await prisma.cart.deleteMany({
            where: { userId }
        });
        return [];
    }
};

module.exports = cartModel;
