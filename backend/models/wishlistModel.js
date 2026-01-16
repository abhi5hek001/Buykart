const prisma = require('../config/db');

const wishlistModel = {
    // Get wishlist items for a user
    async findByUser(userId) {
        const items = await prisma.wishlist.findMany({
            where: { userId: parseInt(userId) },
            include: {
                product: {
                    include: {
                        category: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return items.map(item => ({
            ...item,
            product_name: item.product.name,
            price: item.product.price,
            image_url: item.product.imageUrl,
            stock: item.product.stock,
            description: item.product.description,
            category_name: item.product.category?.name
        }));
    },

    // Check if product is in wishlist
    async isInWishlist(userId, productId) {
        const item = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: parseInt(userId),
                    productId: parseInt(productId)
                }
            }
        });
        return !!item;
    },

    // Add item to wishlist
    async addItem(userId, productId) {
        await prisma.wishlist.create({
            data: {
                userId: parseInt(userId),
                productId: parseInt(productId)
            }
        });
        return this.findByUser(userId);
    },

    // Remove item from wishlist
    async removeItem(userId, productId) {
        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId: parseInt(userId),
                    productId: parseInt(productId)
                }
            }
        });
        return this.findByUser(userId);
    },

    // Clear wishlist
    async clearWishlist(userId) {
        await prisma.wishlist.deleteMany({
            where: { userId: parseInt(userId) }
        });
        return [];
    }
};

module.exports = wishlistModel;
