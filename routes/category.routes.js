const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllCategory,
  createCategory,
  getCategoryById,
} = require('../controllers/category.controllers');

router.get('/', getAllCategory);
router.post('/', createCategory);

// BY ID
router.get('/:kategori_id', getCategoryById);

module.exports = router;
