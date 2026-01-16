/**
 * Main Seed Runner
 * Orchestrates all seeders in the correct order
 * 
 * Usage: npm run seed (or node seed/index.js)
 */

const prisma = require('../config/db');
const { seedCategories, seedProducts } = require('./productSeeder');
const { seedUsers } = require('./userSeeder');
const { seedCart } = require('./cartSeeder');
const { seedWishlist } = require('./wishlistSeeder');
const { seedOrders } = require('./orderSeeder');

async function main() {
    console.log('🚀 Starting database seeding with DummyJSON data...\n');
    console.log('━'.repeat(50));

    try {
        // Clear existing data (in reverse order of dependencies)
        console.log('\n🧹 Clearing existing data...');
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.cart.deleteMany();
        await prisma.wishlist.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.user.deleteMany();
        console.log('✅ Cleared all existing data\n');
        console.log('━'.repeat(50));

        // Seed in order of dependencies
        console.log('\n📦 STEP 1: Categories & Products (from DummyJSON)');
        await seedCategories();
        await seedProducts();
        console.log('━'.repeat(50));

        console.log('\n👤 STEP 2: Users');
        await seedUsers();
        console.log('━'.repeat(50));

        console.log('\n🛒 STEP 3: Cart Items');
        await seedCart();
        console.log('━'.repeat(50));

        console.log('\n❤️ STEP 4: Wishlist Items');
        await seedWishlist();
        console.log('━'.repeat(50));

        console.log('\n📋 STEP 5: Orders');
        await seedOrders();
        console.log('━'.repeat(50));

        // Print summary
        console.log('\n🎉 Database seeding completed successfully!\n');
        console.log('📊 Database Summary:');
        console.log('━'.repeat(50));
        console.log(`   📁 Categories:    ${await prisma.category.count()}`);
        console.log(`   🛍️  Products:      ${await prisma.product.count()}`);
        console.log(`   👤 Users:         ${await prisma.user.count()}`);
        console.log(`   🛒 Cart Items:    ${await prisma.cart.count()}`);
        console.log(`   ❤️  Wishlist:      ${await prisma.wishlist.count()}`);
        console.log(`   📋 Orders:        ${await prisma.order.count()}`);
        console.log(`   📦 Order Items:   ${await prisma.orderItem.count()}`);
        console.log('━'.repeat(50));

    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run if called directly
if (require.main === module) {
    main()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        });
}

module.exports = { main };
