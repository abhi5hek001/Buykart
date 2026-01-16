const userService = require('../services/userService');

const userController = {
    // GET /api/users
    async getAll(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/users/:id
    async getById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/users
    async create(req, res, next) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/users/:id
    async update(req, res, next) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/users/:id
    async delete(req, res, next) {
        try {
            const result = await userService.deleteUser(req.params.id);
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = userController;
