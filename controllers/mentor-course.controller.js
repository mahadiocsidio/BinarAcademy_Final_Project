const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllMentorCourse: async (req, res, next) => {
    try {
    
    } catch (err) {
      next(err);
    }
  },

  createMentorCourse: async (req, res, next) => {
    try{
      
    } catch (err) {
      next (err);
    }
  },

  getMentorCourseById: async (req, res, next) => {
    try{
      
    } catch (err) {
      next (err)
    }
  }
  
};
