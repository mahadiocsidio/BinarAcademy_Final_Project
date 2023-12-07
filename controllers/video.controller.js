const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllVideo: async (req, res, next) => {},

  createVideo: async (req, res, next) => {},

  getVideobyId: async (req, res, next) => {},
};
