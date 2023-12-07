const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllRating: async (req, res, next) => {},

  createRating: async (req, res, next) => {},

  getRatingbyLogin: async (req, res, next) => {},

  craeteRatingbyLogin: async (req, res, next) => {},

  getRatingById: async (req, res, next) => {}
};
