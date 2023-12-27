const router = require('express').Router();
const {imageFilter} = require('../libs/multer');
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllCourse,
  getCoursebyId,
  addCourse,
  beliCourse,
  updateCourse,
} = require('../controllers/course.controllers');

router.get('/', getAllCourse);
router.post('/addCourse', imageFilter.single('url_image_preview'), addCourse);
router.put('/:course_id', imageFilter.single('url_image_preview'), updateCourse);
// BY LOGIN
router.post('/beli', restrict, beliCourse);

// BY ID
router.get('/:course_id', getCoursebyId);

module.exports = router;
