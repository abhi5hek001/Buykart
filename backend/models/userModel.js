const prisma = require('../config/db');
const { generateId } = require('../utils/idGenerator');

const userModel = {
    // Get all users
    async findAll() {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                createdAt: true
            }
        });
    },

    // Get user by ID
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                createdAt: true
            }
        });
    },

    // Get user by email
    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    },

    // Create new user
    async create(userData) {
        const user = await prisma.user.create({
            data: {
                id: generateId('USR'),
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                address: userData.address
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                createdAt: true
            }
        });
        return user;
    },

    // Update user
    async update(id, userData) {
        return await prisma.user.update({
            where: { id },
            data: {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                address: userData.address
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                createdAt: true
            }
        });
    },

    // Delete user
    async delete(id) {
        await prisma.user.delete({
            where: { id }
        });
        return true;
    }
};

module.exports = userModel;
