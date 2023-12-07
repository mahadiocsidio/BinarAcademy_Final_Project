const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllRating,
  createRating,
  craeteRatingbyLogin,
  getRatingbyLogin,
  getRatingById,
} = require('../controllers/rating.controllers');

router.get('/', getAllRating);
router.post('/', createRating);

// BY LOGIN
router.get('/myRates', restrict, getRatingbyLogin);
router.get('/rate', restrict, craeteRatingbyLogin);

// BY ID
router.get('/:rating_id', getRatingById);

module.exports = router;
