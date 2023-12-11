const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllPayment: async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);
      let payment = await prisma.Riwayat_Transaksi.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      const { _count } = await prisma.Riwayat_Transaksi.aggregate({
        _count: { riwayat_transaksi_id: true },
      });

      let pagination = getPagination(req, _count.account_id, page, limit);

      res.status(200).json({
        success: true,
        data: { pagination, payment },
      });
    } catch (error) {
      next(error);
    }
  },

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
          tanggal_pembayaran: new Date(Date.now()),
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

  updatePaymentStatusbyId: async(req,res,next)=>{
    try {
      let {riwayat_transaksi_id} = req.params;
      riwayat_transaksi_id = parseInt(riwayat_transaksi_id, 10);
      let payment = await prisma.Riwayat_Transaksi.update({
        where:{
          riwayat_transaksi_id,
        },
        data:{
          tanggal_pembayaran: new Date(Date.now()),
          status: "Sudah Bayar"
        }
      })

      res.status(200).json({
        success: true,
        message: `Payment with id ${riwayat_transaksi_id} updated`,
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

  createPaymentbyLogin: async (req, res, next) => {
    try {
      let account = req.user
      let { course_id , metode_pembayaran} = req.body;
      let payment = await prisma.Riwayat_Transaksi.create({
        data: {
          account_id: account.account_id,
          course_id,
          tanggal_pembayaran: new Date(Date.now()),
          metode_pembayaran,
          status: "Menunggu Pembayaran"
        },
      });
      if (!payment) return res.json('Payment isnt registered');
      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error)
    }
  },
  
  updatePaymentStatusbyLogin: async(req,res,next)=>{
    try {
      let account = req.user;
      let {course_id} = req.body;
      
      const userTransaction = await prisma.riwayat_Transaksi.findFirst({
        where: {
          account_id: account.account_id,
          course_id: course_id,
        },
      });
  
      if (!userTransaction) {
        return res.status(404).json({
          success: false,
          message: `Transaction not found for account ${account.account_id} and course ${course_id}`,
        });
      }

      let payment = await prisma.Riwayat_Transaksi.update({
        where:{
          riwayat_transaksi_id: userTransaction.riwayat_transaksi_id,
        },
        data:{
          tanggal_pembayaran: new Date(Date.now()),
          status: "Sudah Bayar"
        }
      })

      res.status(200).json({
        success: true,
        message: `Payment with id ${payment.riwayat_transaksi_id} updated`,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },
};
