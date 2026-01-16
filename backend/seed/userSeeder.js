const prisma = require('../config/db');

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
    console.log('🌱 Seeding users...');

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: user,
            create: user
        });
    }

    const count = await prisma.user.count();
    console.log(`✅ Seeded ${count} users`);
    return count;
}

module.exports = { seedUsers, users };
