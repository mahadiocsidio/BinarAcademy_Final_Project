const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllNotif: async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      let notification = await prisma.notifikasi.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      const { _count } = await prisma.notifikasi.aggregate({
        _count: { notifikasi_id: true },
      });

      let pagination = getPagination(req, _count.notifikasi_id, page, limit);

      res.status(200).json({
        stauts: true,
        message: 'success',
        err: null,
        data: { pagination, notification },
      });
    } catch (err) {
      next(err);
    }
  },

  createNotifbyId: async (req, res, next) => {
    try {
      let { account_id, title, deskripsi } = req.body;

      let isExist = await prisma.account.findUnique({
        where: { account_id },
      });
      if (!isExist) {
        return res.status(400).json({
          status: false,
          message: 'bad request',
          err: "account doesn't exist!",
          data: null,
        });
      }

      let notification = await prisma.notifikasi.create({
        data: {
          account_id,
          title,
          deskripsi,
        },
      });

      return res.status(201).json({
        status: true,
        message: 'success',
        err: null,
        data: { notification },
      });
    } catch (err) {
      next(err);
    }
  },

  getNotifbyLogin: async (req, res, next) => {
    try {
      let { account_id } = req.user;
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      // err pencarian acc dihandle oleh restrict
      let notifikasi = await prisma.notifikasi.findMany({
        where: {
          account_id,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const { _count } = await prisma.notifikasi.aggregate({
        _count: { notifikasi_id: true },
        where: { account_id },
      });

      let pagination = getPagination(req, _count.notifikasi_id, page, limit);

      return res.status(200).json({
        status: true,
        message: 'success',
        err: null,
        data: { pagination, notifikasi },
      });
    } catch (err) {
      next(err);
    }
  },

  getNotifbyId: async (req, res, next) => {
    try {
      let { notifikasi_id } = req.params;
      notifikasi_id = Number(notifikasi_id);

      let isExist = await prisma.notifikasi.findUnique({
        where: { notifikasi_id },
      });
      if (!isExist) {
        return res.status(400).json({
          status: false,
          message: 'bad request',
          err: "notification doesn't exist!",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: 'succses!',
        err: null,
        data: { notifikasi: isExist },
      });
    } catch (err) {
      next(err);
    }
  },
  createNotifBroadcast: async (req, res, next) => {
    try {
      let { title, deskripsi } = req.body;

      let pickUser = [];
      let notification = [];

      //filter user yg mau di beri broadcast
      let user = await prisma.account.findMany({
        // CONDITION
        where: { is_verified: true },
      });

      //mendapat id dari tiap filter
      user.forEach((u) => {
        let userId = u.account_id;
        //push tiap id kedalam array
        pickUser.push(userId);
      });

      pickUser.forEach(async (u) => {
        // push notif ke array ke tiap user yg ada
        notification.push({
          account_id: u,
          title,
          deskripsi,
        });
      });
      let blast = await prisma.notifikasi.createMany({
        data: notification,
      });

      return res.status(201).json({
        status: true,
        message: 'success',
        err: null,
        data: { blast },
      });
    } catch (err) {
      next(err);
    }
  },
  createNotifAuto: async (account_id, title, deskripsi, res, next) => {
    try {
      await prisma.notifikasi.create({
        data: {
          account_id,
          title,
          deskripsi,
        },
      });
    } catch (err) {
      // next(err);
      console.log(err);
    }
  },
};
