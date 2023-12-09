const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllPayment: async (req, res, next) => {},

  createPayment: async (req, res, next) => {
    try {
      let { account_id, course_id , metode_pembayaran} = req.body;

      let Course = await prisma.course.findUnique({
        where: {
          course_id,
        }
      });

      if (!Course) return res.json('Course isnt registered');

      let payment = await prisma.Riwayat_Transaksi.create({
        data: {
          account_id,
          course_id,
          tanggal_pembayaran: new Date(),
          metode_pembayaran,
          status: "Menunggu Pembayaran"
        },
      });

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  getPaymentbyLogin: async (req, res, next) => {
    try {
      let account = req.user;

      let payment = await prisma.Riwayat_Transaksi.findMany({
        where: {
          account_id: account.account_id,
        },
        select: {
          riwayat_transaksi_id: true,
          account_id: true,
          Course:{
            select:{
              title: true,
              harga: true,
            }
          },
          status: true,
          tanggal_pembayaran: true,
        },
      });
      if (!payment) return res.json('Payment isnt registered');

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  getPaymentById: async (req, res, next) => {
    try {
      let { account_id} = req.params;
      riwayat_transaksi_id = parseInt(riwayat_transaksi_id, 10);

      let payment = await prisma.Riwayat_Transaksi.findUnique({
        where: {
          account_id,
        },
        select: {
          riwayat_transaksi_id: true,
          account_id: true,
          Course:{
            select:{
              title: true,
              harga: true,
            }
          },
          status: true,
          tanggal_pembayaran: true,
        },
      });
      if (!payment) return res.json('Payment isnt registered');

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }, 

  createPaymentbyLogin: async (req, res, next) => {}, 
};
