const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Email Service - Handles order confirmation emails
 */
const emailService = {
    /**
     * Create nodemailer transporter
     */
    createTransporter() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'sahayabhishek.edu@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });
    },

    /**
     * Generate HTML email template for order confirmation
     */
    generateOrderEmailHTML(order, user) {
        const { items, totalAmount, shippingAddress, id: orderId } = order;

        // Calculate product rows
        const productRows = items.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <strong>${item.product.name}</strong>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                    ₹${parseFloat(item.priceAtPurchase).toFixed(2)}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                    ₹${(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)}
                </td>
            </tr>
        `).join('');

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Buykart</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                🛍️ Buykart
            </h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Thank you for shopping with us!
            </p>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px;">
                Order Confirmed! 🎉
            </h2>
            <p style="color: #666; margin: 0 0 20px 0; font-size: 14px;">
                Hi ${user.name}, your order has been successfully placed.
            </p>

            <!-- Order Details -->
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order ID</p>
                <p style="margin: 0; color: #333; font-size: 20px; font-weight: bold;">#${orderId}</p>
            </div>

            <!-- Products Table -->
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; color: #666; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                            Product
                        </th>
                        <th style="padding: 12px; text-align: center; color: #666; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                            Qty
                        </th>
                        <th style="padding: 12px; text-align: right; color: #666; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                            Price
                        </th>
                        <th style="padding: 12px; text-align: right; color: #666; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${productRows}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 16px; color: #333;">
                            Total Amount
                        </td>
                        <td style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 18px; color: #667eea;">
                            ₹${parseFloat(totalAmount).toFixed(2)}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <!-- Shipping Address -->
            <h3 style="color: #333; margin: 30px 0 15px 0; font-size: 18px;">Shipping Address</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #333; line-height: 1.6;">
                    ${shippingAddress}
                </p>
            </div>

            <!-- Next Steps -->
            <div style="margin-top: 30px; padding: 20px; background-color: #e8f4fd; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">What's Next?</p>
                <ul style="margin: 0; padding-left: 20px; color: #666;">
                    <li style="margin-bottom: 8px;">We'll process your order and prepare it for shipping</li>
                    <li style="margin-bottom: 8px;">You'll receive another email once your order ships</li>
                    <li>Track your order status in your Buykart account</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                Need help? Contact us at 
                <a href="mailto:sahayabhishek.edu@gmail.com" style="color: #667eea; text-decoration: none;">
                    sahayabhishek.edu@gmail.com
                </a>
            </p>
            <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Buykart. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
        `;
    },

    /**
     * Send order confirmation email
     */
    async sendOrderConfirmation(order, user) {
        try {
            // Check if email credentials are configured
            if (!process.env.EMAIL_PASSWORD) {
                console.warn('⚠️ Email password not configured. Skipping email notification.');
                return { success: false, error: 'Email not configured' };
            }

            const transporter = this.createTransporter();
            const htmlContent = this.generateOrderEmailHTML(order, user);

            const mailOptions = {
                from: process.env.EMAIL_FROM || '"Buykart" <sahayabhishek.edu@gmail.com>',
                to: user.email,
                subject: `Order Confirmation - #${order.id} - Buykart`,
                html: htmlContent,
                text: `Thank you for shopping with us!\n\nOrder ID: #${order.id}\nTotal Amount: ₹${order.totalAmount}\n\nYour order has been successfully placed and will be processed shortly.`
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Order confirmation email sent:', info.messageId);

            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Failed to send order confirmation email:', error.message);
            // Non-blocking - don't throw error, just return failure status
            return { success: false, error: error.message };
        }
    }
};

module.exports = emailService;
