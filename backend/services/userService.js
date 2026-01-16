const userModel = require('../models/userModel');

const userService = {
    async getAllUsers() {
        return await userModel.findAll();
    },

    async getUserById(id) {
        const user = await userModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    async createUser(data) {
        if (!data.name || !data.email || !data.password) {
            throw new Error('Name, email and password are required');
        }

        // Check if email already exists
        const existingUser = await userModel.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        return await userModel.create(data);
    },

    async updateUser(id, data) {
        const user = await userModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return await userModel.update(id, data);
    },

    async deleteUser(id) {
        const deleted = await userModel.delete(id);
        if (!deleted) {
            throw new Error('User not found');
        }
        return { message: 'User deleted successfully' };
    }
};

module.exports = userService;
