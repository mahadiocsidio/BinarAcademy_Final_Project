const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllSalary: async (req, res, next) => {
    try {
      let { limit = 10, page = 1, course_id } = req.query;
      limit = Number(limit);
      page = Number(page);
      course_id = Number(course_id)

      let conditions = {}

      if(course_id){
        conditions.course_id = course_id
      }
      let salary = await prisma.salary.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: conditions
      });
      
      const { _count } = await prisma.salary.aggregate({
        where: conditions,
        _count: { salary_id: true },
      });

      let pagination = getPagination(req, _count.salary_id, page, limit);

      res.status(200).json({
        status: true,
        message: 'success',
        err: null,
        data: { pagination, salary },
      });
    } catch (err) {
      next(err);
    }
  },
};
