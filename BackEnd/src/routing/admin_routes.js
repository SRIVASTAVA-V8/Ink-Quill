const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const adminService = require('../service/admin_service');

const routing = express.Router();

routing.use(authMiddleware.validateToken);
routing.use(authMiddleware.checkAdminRole);

//view dashboard
routing.get('/dashboard', async (req, res) => {
    try {
        const summary = await adminService.getDashboardSummary();
        res.status(200).json(summary);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

//get all users
routing.get('/users', async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
//get user by id
routing.get('/users/:id', async (req, res) => {
    try {
        const user = await adminService.getUserById(req.params.id);
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
//update user role
routing.patch('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        const user = await adminService.updateUserRole(req.params.id, role);
        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
//update user status
routing.patch('/users/:id/status', async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await adminService.updateUserStatus(req.params.id, isActive);
        res.status(200).json({ message: 'User status updated successfully', user });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.get('/orders', async (req, res) => {
    try {
        const orders = await adminService.getAllOrders();
        res.status(200).json({ orders });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// Inventory Management Routes
routing.get('/inventory', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const books = await adminService.getInventory(page, limit);
        res.status(200).json({ books });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.get('/inventory/alerts/low-stock', async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 10;
        const lowStockBooks = await adminService.getLowStockAlerts(threshold);
        res.status(200).json({ lowStockBooks });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.get('/inventory/:id', async (req, res) => {
    try {
        const book = await adminService.getInventoryDetails(req.params.id);
        res.status(200).json({ book });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.patch('/inventory/:id/stock', async (req, res) => {
    try {
        const { quantity, operation } = req.body;
        const book = await adminService.updateInventory(req.params.id, quantity, operation);
        res.status(200).json({ message: 'Inventory updated successfully', book });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.patch('/inventory/:id/details', async (req, res) => {
    try {
        const book = await adminService.updateProductDetails(req.params.id, req.body);
        res.status(200).json({ message: 'Product details updated successfully', book });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.post('/inventory/add-book', async (req, res) => {
    try {
        const newBook = await adminService.createBook(req.body);
        res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.put('/inventory/:id', async (req, res) => {
    try {
        const book = await adminService.updateBook(req.params.id, req.body);
        res.status(200).json({ message: 'Book updated successfully', book });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.delete('/inventory/:id', async (req, res) => {
    try {
        const book = await adminService.deleteBook(req.params.id);
        res.status(200).json({ message: 'Book deleted successfully', book });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.post('/inventory/search', async (req, res) => {
    try {
        const { filters = {}, sortBy = 'createdAt', sortOrder = -1, page = 1, limit = 20 } = req.body;
        const results = await adminService.searchAndFilterBooks(filters, sortBy, sortOrder, page, limit);
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// Shipping Management Routes
routing.get('/orders/:id', async (req, res) => {
    try {
        const order = await adminService.getOrderDetails(req.params.id);
        res.status(200).json({ order });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.patch('/orders/:id/shipping', async (req, res) => {
    try {
        const { carrier, trackingNumber, estimatedDeliveryDate } = req.body;
        const order = await adminService.updateShipping(req.params.id, {
            carrier,
            trackingNumber,
            estimatedDeliveryDate
        });
        res.status(200).json({ message: 'Shipping information updated successfully', order });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.patch('/orders/:id/mark-delivered', async (req, res) => {
    try {
        const order = await adminService.markDelivered(req.params.id);
        res.status(200).json({ message: 'Order marked as delivered', order });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.get('/orders/:id/track', async (req, res) => {
    try {
        const tracking = await adminService.trackShipping(req.params.id);
        res.status(200).json({ tracking });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = routing;
