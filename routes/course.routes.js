const router = require('express').Router();
const {getAllCourse,getCoursebyId,addCourse,getCoursesByCategory} = require('../controllers/course.controllers')

router.get('/', getAllCourse)
router.get('/filter', getCoursesByCategory);
router.get('/:course_id',getCoursebyId)
router.post('/addCourse',addCourse)

module.exports=router