const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  getAllCourseProgress: async (req, res, next) => {
    try {
      let { limit = 10, page = 1, account_id } = req.query;
      limit = Number(limit);
      page = Number(page);

      let conditions = {};

      if (account_id) {
        let accountIds = Array.isArray(account_id)
          ? account_id.map((id) => Number(id))
          : [Number(account_id)];
        conditions.account_id = {
          in: accountIds.filter((id) => !isNaN(id)),
        };
      }

      let course_progress = await prisma.course_progress.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: conditions
      });
      const { _count } = await prisma.course_progress.aggregate({
        where: conditions,
        _count: { course_progres_id: true },
      });

      let pagination = getPagination(
        req,
        _count.course_progres_id,
        page,
        limit
      );

      res.status(200).json({
        status: true,
        message: 'success',
        data: { pagination, course_progress },
      });
    } catch (err) {
      next(err);
    }
  },

  createCourseProgress: async (req, res, next) => {
    try {
      let { account_id, course_id, video_id } = req.body;

      let isAccount = await prisma.account.findUnique({
        where: { account_id },
      });
      let isCourse = await prisma.course.findUnique({ where: { course_id } });
      let isVideo = await prisma.video.findUnique({ where: { video_id } });

      //validasi id ditemukan apa tidak
      if (!isAccount) {
        return res.status(400).json({
          status: false,
          message: 'bad request!',
          err: 'Account not found!',
          data: null,
        });
      }
      if (!isCourse) {
        return res.status(400).json({
          status: false,
          message: 'bad request!',
          err: 'Course not found!',
          data: null,
        });
      }
      if (!isVideo) {
        return res.status(400).json({
          status: false,
          message: 'bad request!',
          err: 'Video not found!',
          data: null,
        });
      }

      let progress = await prisma.course_progress.create({
        data: {
          account_id,
          course_id,
          video_id,
        },
      });

      res.status(201).json({
        status: true,
        message: 'success!',
        err: null,
        data: { progress },
      });
    } catch (err) {
      next(err);
    }
  },

  getCourseProgressById: async (req, res, next) => {
    try {
      let { course_progres_id } = req.params;
      course_progres_id = Number(course_progres_id);

      let isExist = await prisma.course_progress.findUnique({
        where: { course_progres_id },
      });

      if (!isExist) {
        return res.status(400).json({
          status: false,
          message: 'bad request!',
          err: 'Course-progress not found!',
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: 'success!',
        err: null,
        data: { progress: isExist },
      });
    } catch (err) {
      next(err);
    }
  },

  getCourseProgressByLogin: async (req, res, next) => {
    try {
      let { account_id } = req.user;
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      // all err get user dihandle oleh restrict

      let progress = await prisma.course_progress.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { account_id },
      });

      const { _count } = await prisma.course_progress.aggregate({
        _count: { course_progres_id: true },
      });

      let pagination = getPagination(
        req,
        _count.course_progres_id,
        page,
        limit
      );

      res.status(200).json({
        status: true,
        message: 'success!',
        err: null,
        data: { pagination, progress },
      });
    } catch (err) {
      next(err);
    }
  },
  autoAddCourseProgress: async (account_id, course_id, res) => {
    try {
      let pickChapter = [];
      let pickVideo = [];
      let userProgress = [];

      //filter chapter yg mau di add berdasar course
      let chapter = await prisma.chapter.findMany({
        where: { course_id },
      });
      //push kedalam array pickChapter
      chapter.forEach((c) => {
        let chapterId = c.chapter_id;
        //push tiap id kedalam array
        pickChapter.push(chapterId);
      });

      // mencari tiap video berdasar chapter
      let video = await prisma.video.findMany({
        where: { chapter_id: { in: pickChapter } },
      });
      video.forEach((v) => {
        let videoId = v.video_id;
        //push tiap id kedalam array
        pickVideo.push(videoId);
      });

      pickVideo.forEach(async (v) => {
        userProgress.push({
          account_id,
          course_id,
          video_id: v,
        });
      });
      // blast data berdasar array userProgress
      await prisma.course_progress.createMany({
        data: userProgress,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
