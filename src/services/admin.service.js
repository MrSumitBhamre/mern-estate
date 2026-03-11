// src/services/admin.service.js
const repo = require('../repositories/admin.repository');

exports.dashboard = async () => {
    return await repo.getDashboardStats();
};

exports.pendingProperties = async () => {
    return await repo.getPendingProperties();
};

exports.approveProperty = async (id) => {
    await repo.updatePropertyStatus(id, 'APPROVED');
};

exports.rejectProperty = async (id) => {
    await repo.updatePropertyStatus(id, 'REJECTED');
};

exports.users = async () => {
    return await repo.getAllUsers();
};

exports.blockUser = async (id) => {
    await repo.updateUserStatus(id, 'BANNED');
};

exports.monthlyRevenue = async () => {
    return await repo.getMonthlyRevenue();
};

exports.bookingAnalytics = async () => {
    return await repo.getBookingAnalytics();
};