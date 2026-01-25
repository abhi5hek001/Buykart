const prisma = require('../config/db');
const { generateId } = require('../utils/idGenerator');
const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Abhishek Sahay',
        email: 'abhishek.sy22@iiits.in',
        password: 'Password123!',
        phone: '9876543210',
        address: '123 Main St, Mumbai, Maharashtra 400001'
    },
    {
        name: 'Mude Mamatha',
        email: 'mamathakrishna231@gmail.com',
        password: 'Password123!',
        phone: '9876543211',
        address: '456 Park Ave, Delhi, Delhi 110001'
    },
    {
        name: 'Darshika Soni',
        email: 'darshika.soni8961@gmail.com',
        password: 'Password123!',
        phone: '9876543212',
        address: '789 MG Road, Bangalore, Karnataka 560001'
    }
];

async function seedUsers() {
    console.log('🌱 Seeding users (with hashed passwords)...');

    for (const userData of users) {
        // Upsert by email - Using findUnique + create because create is safer for custom IDs
        const existing = await prisma.user.findUnique({
            where: { email: userData.email }
        });

        if (!existing) {
            // Hash the password before seeding
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            await prisma.user.create({
                data: {
                    id: generateId('USR'),
                    ...userData,
                    password: hashedPassword
                }
            });
        }
    }

    const count = await prisma.user.count();
    console.log(`✅ Seeded ${count} users with String IDs`);
    return count;
}

module.exports = { seedUsers, users };
