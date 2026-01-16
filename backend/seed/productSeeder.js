/**
 * Product and Category Seeder using DummyJSON API
 * Fetches real product data with images from dummyjson.com
 */

const prisma = require('../config/db');

// Store category mapping for use by other seeders
let categoryMap = {};

async function seedCategories() {
    console.log('🌱 Fetching categories from DummyJSON...');

    try {
        // Fetch all products to get categories
        const response = await fetch('https://dummyjson.com/products?limit=0');
        const data = await response.json();
        const products = data.products;

        // Extract unique categories
        const uniqueCategories = [...new Set(products.map((p) => p.category))];

        for (const categoryName of uniqueCategories) {
            const formattedName = categoryName
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Check if category already exists
            let category = await prisma.category.findFirst({
                where: { name: formattedName },
            });

            if (!category) {
                category = await prisma.category.create({
                    data: {
                        name: formattedName,
                        description: `${formattedName} products`,
                    },
                });
            }

            categoryMap[categoryName] = category.id;
        }

        const count = await prisma.category.count();
        console.log(`✅ Seeded ${count} categories from DummyJSON`);
        return categoryMap;
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        throw error;
    }
}

async function seedProducts() {
    console.log('🌱 Fetching products from DummyJSON...');

    try {
        // Fetch all products from DummyJSON (limit=0 means all)
        const response = await fetch('https://dummyjson.com/products?limit=0');
        const data = await response.json();
        const products = data.products;

        // If categoryMap is empty, rebuild it
        if (Object.keys(categoryMap).length === 0) {
            const categories = await prisma.category.findMany();
            for (const cat of categories) {
                // Convert formatted name back to slug format for mapping
                const slug = cat.name.toLowerCase().replace(/ /g, '-');
                categoryMap[slug] = cat.id;
            }
        }

        let created = 0;
        let updated = 0;

        for (const product of products) {
            const existing = await prisma.product.findFirst({
                where: { name: product.title },
            });

            const productData = {
                name: product.title,
                description: product.description,
                price: Math.round(product.price * 83), // Convert USD to INR
                stock: product.stock,
                imageUrl: product.thumbnail,
                categoryId: categoryMap[product.category],
            };

            if (!existing) {
                await prisma.product.create({ data: productData });
                created++;
            } else {
                await prisma.product.update({
                    where: { id: existing.id },
                    data: {
                        imageUrl: product.thumbnail,
                        description: product.description,
                        price: productData.price,
                        stock: product.stock,
                    },
                });
                updated++;
            }
        }

        const count = await prisma.product.count();
        console.log(`✅ Seeded ${count} products (${created} new, ${updated} updated)`);
        return count;
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    }
}

module.exports = { seedCategories, seedProducts, categoryMap };
