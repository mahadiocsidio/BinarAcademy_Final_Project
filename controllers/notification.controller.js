const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllNotif: async (req, res, next) => {},

  createNotif: async (req, res, next) => {},

  getNotifbyAccountId: async (req, res, next) => {},

  getNotifbyId: async (req, res, next) => {},
};
