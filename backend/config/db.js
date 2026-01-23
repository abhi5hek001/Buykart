const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },  
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Test connection
prisma.$connect()
    .then(() => {
        console.log('✅ Prisma connected to database successfully');
    })
    .catch((err) => {
        console.error('❌ Prisma database connection failed:', err.message);
    });

module.exports = prisma;
