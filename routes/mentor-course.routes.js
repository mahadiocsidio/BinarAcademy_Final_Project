const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllMentorCourse,
  createMentorCourse,
  getMentorCourseById,
} = require('../controllers/mentor-course.controller');

router.get('/', getAllMentorCourse);
router.post('/', createMentorCourse);

// BY LOGIN

// BY ID
router.get('/:mentor_course_id', getMentorCourseById);

module.exports = router;
