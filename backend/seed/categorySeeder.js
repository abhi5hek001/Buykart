const prisma = require('../config/db');

const { generateId } = require('../utils/idGenerator');

const categories = [
    { name: 'Beauty', description: 'Beauty products' },
    { name: 'Fragrances', description: 'Fragrances products' },
    { name: 'Furniture', description: 'Furniture products' },
    { name: 'Groceries', description: 'Groceries products' },
    { name: 'Home Decoration', description: 'Home Decoration products' },
    { name: 'Kitchen Accessories', description: 'Kitchen Accessories products' },
    { name: 'Laptops', description: 'Laptops products' },
    { name: 'Mens Shirts', description: 'Mens Shirts products' },
    { name: 'Mens Shoes', description: 'Mens Shoes products' },
    { name: 'Mens Watches', description: 'Mens Watches products' },
    { name: 'Mobile Accessories', description: 'Mobile Accessories products' },
    { name: 'Motorcycle', description: 'Motorcycle products' },
    { name: 'Skin Care', description: 'Skin Care products' },
    { name: 'Smartphones', description: 'Smartphones products' },
    { name: 'Sports Accessories', description: 'Sports Accessories products' },
    { name: 'Sunglasses', description: 'Sunglasses products' },
    { name: 'Tablets', description: 'Tablets products' },
    { name: 'Tops', description: 'Tops products' },
    { name: 'Vehicle', description: 'Vehicle products' },
    { name: 'Womens Bags', description: 'Womens Bags products' },
    { name: 'Womens Dresses', description: 'Womens Dresses products' },
    { name: 'Womens Jewellery', description: 'Womens Jewellery products' },
    { name: 'Womens Shoes', description: 'Womens Shoes products' },
    { name: 'Womens Watches', description: 'Womens Watches products' }
];

async function seedCategories() {
    console.log('🌱 Seeding categories...');

    for (const categoryData of categories) {
        // Check if exists by name
        const existing = await prisma.category.findFirst({
            where: { name: categoryData.name }
        });

        if (!existing) {
            await prisma.category.create({
                data: {
                    id: generateId('CAT'),
                    ...categoryData
                }
            });
        }
    }

    const count = await prisma.category.count();
    console.log(`✅ Seeded ${count} categories with String IDs`);
    return count;
}

module.exports = { seedCategories, categories };
