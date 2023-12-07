const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllCategory: async (req, res, next) => {},

  createCategory: async (req, res, next) => {},

  getCategoryById: async (req, res, next) => {},
};
