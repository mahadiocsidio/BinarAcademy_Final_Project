const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllPayment: async (req, res, next) => {},

  createPayment: async (req, res, next) => {},

  getPaymentbyLogin: async (req, res, next) => {},

  getPaymentById: async (req, res, next) => {}, 

  createPaymentbyLogin: async (req, res, next) => {}, 
};
