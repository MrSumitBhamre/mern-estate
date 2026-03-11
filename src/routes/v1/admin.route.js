// src/routes/v1/admin.route.js
const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin.controller');
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');

router.use(auth, role(1)); // ADMIN only

router.get('/dashboard', controller.dashboard);
router.get('/properties/pending', controller.pendingProperties);
router.patch('/properties/:id/approve', controller.approveProperty);
router.patch('/properties/:id/reject', controller.rejectProperty);

router.get('/users', controller.users);
router.patch('/users/:id/block', controller.blockUser);

router.get('/analytics/revenue', controller.monthlyRevenue);
router.get('/analytics/bookings', controller.bookingAnalytics);

module.exports = router;