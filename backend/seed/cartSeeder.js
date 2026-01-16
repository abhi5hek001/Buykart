/**
 * Cart Seeder - Adds random products to each user's cart
 * Each user gets 2-4 cart items with varying quantities
 */

const prisma = require('../config/db');

async function seedCart() {
    console.log('🌱 Seeding carts...');

    try {
        const users = await prisma.user.findMany();
        const products = await prisma.product.findMany();

        if (users.length === 0 || products.length === 0) {
            console.log('⚠️ No users or products found. Skipping cart seeding.');
            return 0;
        }

        let totalCartItems = 0;

        for (const user of users) {
            // Each user gets 2-4 cart items
            const numItems = 2 + Math.floor(Math.random() * 3);

            // Pick random products for cart (different from wishlist)
            const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
            const cartProducts = shuffledProducts.slice(0, numItems);

            for (const product of cartProducts) {
                // Random quantity 1-3
                const quantity = 1 + Math.floor(Math.random() * 3);

                // Check if already in cart
                const existing = await prisma.cart.findFirst({
                    where: {
                        userId: user.id,
                        productId: product.id,
                    },
                });

                if (!existing) {
                    await prisma.cart.create({
                        data: {
                            userId: user.id,
                            productId: product.id,
                            quantity,
                        },
                    });
                    totalCartItems++;
                } else {
                    // Update quantity if exists
                    await prisma.cart.update({
                        where: { id: existing.id },
                        data: { quantity: existing.quantity + quantity },
                    });
                }
            }
        }

        const count = await prisma.cart.count();
        console.log(`✅ Seeded ${count} cart items`);
        return count;
    } catch (error) {
        console.error('❌ Error seeding cart:', error);
        throw error;
    }
}

module.exports = { seedCart };
