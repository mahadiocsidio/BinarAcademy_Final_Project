const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controllers');

router.get('/', getAllCategory);
router.post('/', createCategory);

// BY ID
router.get('/:kategori_id', getCategoryById);
// UPDATE
router.put('/:kategori_id', updateCategory);
// DELETE
router.delete('/:kategori_id', deleteCategory);


module.exports = router;
