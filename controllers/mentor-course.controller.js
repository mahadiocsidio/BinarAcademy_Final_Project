const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllMentorCourse: async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      const mentor = await prisma.mentor.findMany({
        skip: (page - 1) * limit,
        take: limit
      });

      const { _count } = await prisma.mentor.aggregate({
        _count: { mentor_id: true },
      });

      let pagination = getPagination(req, _count.mentor_id, page, limit);

      res.status(200).json({
        status: true,
        message: 'success',
        data: { pagination, mentor },
      });
    } catch (err) {
      next(err);
    }
  },

  createMentorCourse: async (req, res, next) => {},

  getMentorCourseById: async (req, res, next) => {},
};
