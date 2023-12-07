const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllCourseProgress: async (req, res, next) => {},

  createCourseProgress: async (req, res, next) => {},

  getCourseProgressByLogin: async (req, res, next) => {},

  getCourseProgressById: async (req, res, next) => {},
};
