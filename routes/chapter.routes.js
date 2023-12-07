const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllChapter,
  createChapter,
  getChapterById,
} = require('../controllers/chapter.controllers');

router.get('/', getAllChapter);
router.post('/', createChapter);

// BY ID
router.get('/:chapter_id', getChapterById);

module.exports = router;
