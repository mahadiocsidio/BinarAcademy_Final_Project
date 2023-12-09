const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { getPagination } = require('../helper/index');

module.exports = {
  //get seluruh rating
  getAllRating: async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      const rating = await prisma.rating.findMany({
        skip: (page - 1) * limit,
        take: limit
      });

      const { _count } = await prisma.rating.aggregate({
        _count: { rating_id: true },
      });

      let pagination = getPagination(req, _count.rating_id, page, limit);

      res.status(200).json({
        stauts: true,
        message: 'success',
        data: { pagination, rating },
      });
    } catch (err) {
      next(err);
    }
  },

  // get rating berdasarkan skor
  getAllRatingBySkor: async (req, res, next) => {
    try {
        let { rating_id, skor, sort, order, limit = 10, page = 1 } = req.query;
        limit = Number(limit);
        page = Number(page);

        const requestedSkor = parseInt(skor, 10);

        if (requestedSkor > 5) {
            res.status(400).json({
                status: false,
                message: 'Bad request!',
                err: 'Score cannot be greater than 5.',
                data: null
            });
        } else {
            const ratingId = Array.isArray(rating_id) ? rating_id.map(id => parseInt(id, 10)) : [parseInt(rating_id, 10)];

            const allRatings = await prisma.rating.findMany({
                select: {
                    account_id: true,
                    course_id: true,
                    skor: true,
                    comment: true,
                },
            });

            const filteredRatings = allRatings.filter(rating => rating.skor === requestedSkor);

            if (filteredRatings.length === 0) {
                res.status(200).json({
                    status: true,
                    message: 'No data found for the requested score.',
                    data: null
                });
            } else {
                const orderBy = sort && order ? { [sort]: order } : undefined;

                const sortedFilteredRatings = orderBy ? filteredRatings.sort((a, b) => a[sort] - b[sort]) : filteredRatings;

                // Pagination
                let rating = await prisma.rating.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                });

                const { _count } = await prisma.rating.aggregate({
                    _count: { rating_id: true },
                });

                let pagination = getPagination(req, _count.rating_id, page, limit);

                res.status(200).json({
                    status: true,
                    message: 'Successful get all rating by skor',
                    data: { pagination, rating },
                });
            }
        }
    } catch (error) {
        next(error);
    }
  },

  //Membuat rating
  createRatingbyLogin: async (req, res, next) => {
    try {
        const { course_id, skor, comment } = req.body;
        let { account_id } = req.user;

        // Check if the course exists
        let isExist = await prisma.course.findUnique({
            where: { course_id },
        });

        if (!isExist) {
            return res.status(400).json({
                status: false,
                message: 'bad request',
                err: "Course not found",
                data: null,
            });
        }

        // Validate skor to be within range (0 to 5)
        const skorValue = parseInt(skor, 10);
        if (skorValue < 0 || skorValue > 5 || isNaN(skorValue)) {
            return res.status(400).json({
                status: false,
                message: 'bad request',
                err: "Skor should be a number between 0 and 5",
                data: null,
            });
        }

        const createRating = await prisma.rating.create({
            data: {
                account_id: account_id,
                course_id,
                skor: skorValue,
                comment
            }
        });

        return res.status(201).json({
            status: true,
            message: 'Successful create rating',
            err: null,
            data: { createRating }
        });

    } catch (err) {
        next(err)
    }
  },

  //mendapatkan rating dari login
  getRatingbyLogin: async (req, res, next) => {
    try {
      let {account_id} = req.user
      
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      const rating = await prisma.rating.findMany({
        where: {
          account_id: account_id // Filter berdasarkan account_id
        },
        skip: (page - 1) * limit,
        take: limit
      });

      const { _count } = await prisma.rating.aggregate({
        _count: { rating_id: true },
      });

      let pagination = getPagination(req, _count.rating_id, page, limit);

      res.status(200).json({
        stauts: true,
        message: 'success',
        data: { pagination, rating },
      });
    } catch (err) {
      next(err);
    }
  },

  //mendapatkan rating berdasarkan id
  getRatingById: async (req, res, next) => {
    try {
      let { rating_id } = req.params;
      rating_id = Number(rating_id)

      let isExist = await prisma.rating.findUnique({
        where: {
          rating_id,
        },
      });

      if (!isExist) {
        return res.status(400).json({
          status: false,
          message: 'bad request!',
          err: 'rating not found!',
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: 'success!',
        err: null,
        data: { rating: isExist },
      });
    } catch (err) {
      next(err);
    }
  },

  //melakukan update rating
  updateRating: async (req, res, next) => {
    try {
      const { skor, comment } = req.body;
      const { account_id } = req.user;
      const { rating_id } = req.params;
  
      // Periksa apakah rating dengan rating_id yang diberikan ada dalam database
      const existingRating = await prisma.rating.findUnique({
        where: {
          rating_id: Number(rating_id)
        }
      });
  
      // Validasi apakah rating dengan rating_id yang diberikan ada
      if (!existingRating) {
        return res.status(400).json({
          status: false,
          message: 'Bad request!',
          err: 'Rating not found',
          data: null,
        });
      }
  
      // Lakukan pembaruan rating
      const updatedRating = await prisma.rating.update({
        where: {
          rating_id: Number(rating_id)
        },
        data: { skor, comment }
      });
  
      return res.status(200).json({
        status: true,
        message: 'Successful update rating',
        err: null,
        data: { rating: updatedRating }
      });
  
    } catch (err) {
      next(err);
    }
  },

//melakukan delete rating
deleteRating : async (req, res, next) => {
  try{
      let { rating_id } = req.params;
      let {account_id} = req.user;

      let isExist = await prisma.rating.findUnique({
        where: {
          rating_id: Number(rating_id)
        },
      });

      if (!isExist) {
        return res.status(400).json({
          status: false,
          message: 'bad request!',
          err: 'rating not found!',
          data: null,
        });
      }

      const deleteRating = await prisma.rating.delete({
          where: {
              rating_id: Number(rating_id)
          }
      });

      return res.status(200).json({
          status: true,
          message: 'Successful delete rating',
          err: null,
          data: deleteRating
      });

    } catch (err) {
        next (err)
    }     
  } 
};