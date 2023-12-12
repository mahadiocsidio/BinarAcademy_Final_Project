const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllCourse,
  getCoursebyId,
  addCourse,
  beliCourse,
} = require('../controllers/course.controllers');

router.get('/', getAllCourse);
router.post('/addCourse', addCourse);

// BY LOGIN
router.post('/beli', restrict, beliCourse);

// BY ID
router.get('/:course_id', getCoursebyId);

module.exports = router;
