/**
 * Order Seeder - Creates sample orders for each user
 * Each user gets 3-4 orders with random products
 */

const prisma = require('../config/db');

// Order statuses to cycle through
const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];

// Generate random date within last 6 months
function randomDate() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    return new Date(
        sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime())
    );
}

// Generate random shipping address based on user
function generateShippingAddress(user) {
    return `${user.name}, ${user.address}, Phone: ${user.phone || 'N/A'}`;
}

async function seedOrders() {
    console.log('🌱 Seeding orders...');

    try {
        // Get all users and products
        const users = await prisma.user.findMany();
        const products = await prisma.product.findMany();

        if (users.length === 0 || products.length === 0) {
            console.log('⚠️ No users or products found. Skipping order seeding.');
            return 0;
        }

        let totalOrders = 0;
        let totalOrderItems = 0;

        for (const user of users) {
            // Each user gets 3-4 orders
            const numOrders = 3 + Math.floor(Math.random() * 2);

            for (let i = 0; i < numOrders; i++) {
                // Random 1-4 items per order
                const numItems = 1 + Math.floor(Math.random() * 4);
                const orderItems = [];
                let orderTotal = 0;

                // Pick random products for this order
                const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
                const selectedProducts = shuffledProducts.slice(0, numItems);

                for (const product of selectedProducts) {
                    const quantity = 1 + Math.floor(Math.random() * 3);
                    const priceAtPurchase = Number(product.price);
                    orderTotal += priceAtPurchase * quantity;

                    orderItems.push({
                        productId: product.id,
                        quantity,
                        priceAtPurchase,
                    });
                }

                // Create order with items
                const order = await prisma.order.create({
                    data: {
                        userId: user.id,
                        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
                        totalAmount: orderTotal,
                        shippingAddress: generateShippingAddress(user),
                        createdAt: randomDate(),
                        items: {
                            create: orderItems,
                        },
                    },
                    include: { items: true },
                });

                totalOrders++;
                totalOrderItems += order.items.length;
            }
        }

        console.log(`✅ Seeded ${totalOrders} orders with ${totalOrderItems} order items`);
        return totalOrders;
    } catch (error) {
        console.error('❌ Error seeding orders:', error);
        throw error;
    }
}

module.exports = { seedOrders };
