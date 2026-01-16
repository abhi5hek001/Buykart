/**
 * Wishlist Seeder - Adds random products to each user's wishlist
 * Each user gets 3-6 wishlisted products
 */

const prisma = require('../config/db');

async function seedWishlist() {
    console.log('🌱 Seeding wishlists...');

    try {
        const users = await prisma.user.findMany();
        const products = await prisma.product.findMany();

        if (users.length === 0 || products.length === 0) {
            console.log('⚠️ No users or products found. Skipping wishlist seeding.');
            return 0;
        }

        let totalWishlistItems = 0;

        for (const user of users) {
            // Each user gets 3-6 wishlist items
            const numItems = 3 + Math.floor(Math.random() * 4);

            // Pick random products for wishlist
            const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
            const wishlistProducts = shuffledProducts.slice(0, numItems);

            for (const product of wishlistProducts) {
                // Check if already in wishlist
                const existing = await prisma.wishlist.findFirst({
                    where: {
                        userId: user.id,
                        productId: product.id,
                    },
                });

                if (!existing) {
                    await prisma.wishlist.create({
                        data: {
                            userId: user.id,
                            productId: product.id,
                        },
                    });
                    totalWishlistItems++;
                }
            }
        }

        const count = await prisma.wishlist.count();
        console.log(`✅ Seeded ${count} wishlist items`);
        return count;
    } catch (error) {
        console.error('❌ Error seeding wishlist:', error);
        throw error;
    }
}

module.exports = { seedWishlist };
