const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllChapter: async (req, res, next) => {},

  createChapter: async (req, res, next) => {},

  getChapterById: async (req, res, next) => {},
};
