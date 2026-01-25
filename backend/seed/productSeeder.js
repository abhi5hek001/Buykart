const prisma = require('../config/db');
const { generateId } = require('../utils/idGenerator');

// Category Slug Map (Product Category -> Our Category Name)
const categorySlugMap = {
    'beauty': 'Beauty',
    'fragrances': 'Fragrances',
    'furniture': 'Furniture',
    'groceries': 'Groceries',
    'home-decoration': 'Home Decoration',
    'kitchen-accessories': 'Kitchen Accessories',
    'laptops': 'Laptops',
    'mens-shirts': 'Mens Shirts',
    'mens-shoes': 'Mens Shoes',
    'mens-watches': 'Mens Watches',
    'mobile-accessories': 'Mobile Accessories',
    'motorcycle': 'Motorcycle',
    'skin-care': 'Skin Care',
    'smartphones': 'Smartphones',
    'sports-accessories': 'Sports Accessories',
    'sunglasses': 'Sunglasses',
    'tablets': 'Tablets',
    'tops': 'Tops',
    'vehicle': 'Vehicle',
    'womens-bags': 'Womens Bags',
    'womens-dresses': 'Womens Dresses',
    'womens-jewellery': 'Womens Jewellery',
    'womens-shoes': 'Womens Shoes',
    'womens-watches': 'Womens Watches'
};

async function seedProducts() {
    console.log('🌱 Fetching products from DummyJSON...');

    try {
        // Fetch all categories first to get their IDs
        const categories = await prisma.category.findMany();
        // Create a map of "Category Name" -> "Category ID"
        const categoryIdMap = {};
        categories.forEach(c => {
            categoryIdMap[c.name] = c.id;
        });

        // Fetch all products from DummyJSON
        const response = await fetch('https://dummyjson.com/products?limit=0');
        const data = await response.json();
        const products = data.products;

        let created = 0;

        for (const product of products) {
            // Map DummyJSON category slug to our Category Name, then to ID
            const categoryName = categorySlugMap[product.category];
            const categoryId = categoryIdMap[categoryName];

            if (!categoryId) {
                console.warn(`⚠️ Skipping product "${product.title}" - Unknown/Unmapped category: ${product.category}`);
                continue;
            }

            const productData = {
                id: generateId('PRD'), // Generate String ID
                name: product.title,
                description: product.description,
                price: Math.round(product.price * 83), // Convert USD to INR
                stock: product.stock,
                imageUrl: product.thumbnail,
                categoryId: categoryId,
            };

            await prisma.product.create({
                data: productData
            });

            created++;
        }

        const count = await prisma.product.count();
        console.log(`✅ Seeded ${count} products with String IDs`);
        return count;
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    }
}

module.exports = { seedProducts };
