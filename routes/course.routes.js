const router = require('express').Router();
const {restrict} = require('../middlewares/auth.middlewares')
const {getAllCourse,getCoursebyId,addCourse,getCoursesByCategory,getCoursebyTitle,beliCourse} = require('../controllers/course.controllers')

router.get('/', getAllCourse)
router.get('/filter', getCoursesByCategory)
router.get('/search', getCoursebyTitle)
router.get('/:course_id',getCoursebyId)
router.post('/addCourse',addCourse)

//by login
router.post('/beli',restrict,beliCourse)

module.exports=router