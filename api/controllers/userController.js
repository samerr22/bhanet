const User = require('../models/User');

// @desc    Get all users | GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create user | POST /api/users
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: "Invalid user data" });
    }
};

// @desc    Update user | PUT /api/users/:id
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete user | DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ id: req.params.id, message: "User deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };