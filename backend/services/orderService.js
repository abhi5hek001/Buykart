const prisma = require('../config/db');
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');
const { generateId } = require('../utils/idGenerator');

const orderService = {
    async getAllOrders() {
        return await orderModel.findAll();
    },

    async getOrdersByUser(userId) {
        return await orderModel.findByUser(userId);
    },

    async getOrderById(id) {
        const order = await orderModel.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    },

    // Create order with ACID properties and row-level locking
    async createOrder(orderData) {
        const { user_id, items, shipping_address } = orderData;

        if (!user_id || !items || items.length === 0) {
            throw new Error('User ID and items are required');
        }

        // Use Prisma interactive transaction with proper isolation
        const result = await prisma.$transaction(async (tx) => {
            // Step 1: Lock and validate stock for all products using SELECT FOR UPDATE
            // This prevents race conditions when multiple users order simultaneously
            const validatedItems = [];
            let totalAmount = 0;

            for (const item of items) {
                // Use raw SQL with FOR UPDATE to lock the product row
                // This ensures ACID compliance - no other transaction can modify this row
                const [product] = await tx.$queryRaw`
                    SELECT id, name, price, stock 
                    FROM products 
                    WHERE id = ${item.product_id}
                    FOR UPDATE
                `;

                if (!product) {
                    throw new Error(`Product with ID ${item.product_id} not found`);
                }

                // Check stock availability (ACID - Consistency)
                if (product.stock < item.quantity) {
                    throw new Error(
                        `Insufficient stock for "${product.name}". ` +
                        `Requested: ${item.quantity}, Available: ${product.stock}`
                    );
                }

                const subtotal = Number(product.price) * item.quantity;
                totalAmount += subtotal;

                validatedItems.push({
                    product_id: product.id,
                    product_name: product.name,
                    quantity: item.quantity,
                    price_at_purchase: product.price
                });
            }

            // Step 2: Create order (ACID - Atomicity)
            const order = await tx.order.create({
                data: {
                    id: generateId('ORD'),
                    userId: user_id,
                    totalAmount: totalAmount,
                    shippingAddress: shipping_address
                }
            });

            // Step 3: Create order items and decrement stock (ACID - Atomicity & Isolation)
            for (const item of validatedItems) {
                // Create order item
                await tx.orderItem.create({
                    data: {
                        id: generateId('ORI'),
                        orderId: order.id,
                        productId: item.product_id,
                        quantity: item.quantity,
                        priceAtPurchase: item.price_at_purchase
                    }
                });

                // Decrement stock using atomic operation
                // MySQL will ensure this operation completes or fails as a unit
                await tx.$executeRaw`
                    UPDATE products 
                    SET stock = stock - ${item.quantity}
                    WHERE id = ${item.product_id}
                `;
            }

            // Return order ID for further processing
            return order.id;
        }, {
            // Set transaction isolation level to ensure proper locking
            isolationLevel: 'ReadCommitted',
            maxWait: 5000, // Maximum time to wait for transaction to start (5s)
            timeout: 10000 // Maximum time for transaction to complete (10s)
        });

        // Step 4: Invalidate Redis cache for updated products (outside transaction)
        const cacheService = require('./cacheService');
        for (const item of items) {
            await cacheService.invalidateProduct(item.product_id);
        }
        await cacheService.del(cacheService.CACHE_KEYS?.STOCK_ALL || 'stock:all');

        // Step 5: Clear user's cart after successful order
        await cartModel.clearCart(user_id);

        // Step 6: Get complete order details with user info for email
        const completeOrder = await orderModel.findById(result);

        // Step 7: Send order confirmation email (non-blocking)
        // Email failure should not affect order creation
        const emailService = require('./emailService');
        emailService.sendOrderConfirmation(completeOrder, completeOrder.user)
            .then(emailResult => {
                if (emailResult.success) {
                    console.log(`✅ Email sent for order #${result}`);
                } else {
                    console.warn(`⚠️ Email failed for order #${result}:`, emailResult.error);
                }
            })
            .catch(err => {
                console.error(`❌ Email error for order #${result}:`, err.message);
            });

        return completeOrder;
    },

    async updateOrderStatus(id, status) {
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid order status');
        }
        return await orderModel.updateStatus(id, status);
    },

    // Calculate cart total for an order
    async calculateTotal(items) {
        let total = 0;
        for (const item of items) {
            const product = await productModel.findById(item.product_id);
            if (product) {
                total += Number(product.price) * item.quantity;
            }
        }
        return total;
    }
};

module.exports = orderService;
