const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllMentorCourse: async (req, res, next) => {},

  createMentorCourse: async (req, res, next) => {},

  getMentorCourseById: async (req, res, next) => {},
};
