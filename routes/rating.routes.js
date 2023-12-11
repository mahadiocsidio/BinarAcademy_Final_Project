const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllRating,
  createRatingbyLogin,
  getRatingbyLogin,
  getRatingById,
  updateRating,
  deleteRating,
  getAllRatingBySkor,
} = require('../controllers/rating.controllers');

router.get('/', getAllRating);
router.get('/filter', getAllRatingBySkor);

// BY LOGIN
router.get('/myRates', restrict, getRatingbyLogin);
router.post('/rate', restrict, createRatingbyLogin);
router.put('/:rating_id', restrict, updateRating);
router.delete('/:rating_id', restrict, deleteRating);

// BY ID
router.get('/:rating_id', getRatingById);

module.exports = router;
