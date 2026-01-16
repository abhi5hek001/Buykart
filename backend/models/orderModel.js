const prisma = require('../config/db');

const orderModel = {
    // Get all orders for a user
    async findByUser(userId) {
        return await prisma.order.findMany({
            where: { userId: parseInt(userId) },
            include: {
                items: {
                    include: {
                        product: {
                            select: { name: true, imageUrl: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    // Get all orders
    async findAll() {
        return await prisma.order.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    // Get order by ID with items
    async findById(id) {
        return await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                items: {
                    include: {
                        product: {
                            select: { name: true, imageUrl: true }
                        }
                    }
                }
            }
        });
    },

    // Create order (within transaction)
    async create(orderData, tx) {
        return await tx.order.create({
            data: {
                userId: orderData.user_id,
                totalAmount: orderData.total_amount,
                shippingAddress: orderData.shipping_address
            }
        });
    },

    // Create order item (within transaction)
    async createItem(itemData, tx) {
        await tx.orderItem.create({
            data: {
                orderId: itemData.order_id,
                productId: itemData.product_id,
                quantity: itemData.quantity,
                priceAtPurchase: itemData.price_at_purchase
            }
        });
    },

    // Update order status
    async updateStatus(id, status) {
        return await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                items: {
                    include: {
                        product: {
                            select: { name: true, imageUrl: true }
                        }
                    }
                }
            }
        });
    }
};

module.exports = orderModel;
