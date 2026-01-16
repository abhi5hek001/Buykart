const prisma = require('../config/db');

const categories = [
    { name: 'Electronics', description: 'Electronic gadgets and devices' },
    { name: 'Clothing', description: 'Fashion and apparel' },
    { name: 'Home & Kitchen', description: 'Home appliances and kitchen items' },
    { name: 'Books', description: 'Books and educational materials' },
    { name: 'Sports', description: 'Sports equipment and fitness gear' }
];

async function seedCategories() {
    console.log('🌱 Seeding categories...');

    for (const category of categories) {
        await prisma.category.upsert({
            where: { id: categories.indexOf(category) + 1 },
            update: category,
            create: category
        });
    }

    const count = await prisma.category.count();
    console.log(`✅ Seeded ${count} categories`);
    return count;
}

module.exports = { seedCategories, categories };
