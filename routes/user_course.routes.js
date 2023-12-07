const express = require('express')
const router = express.Router()
const {restrict} = require('../middlewares/auth.middlewares')
const {getAllUserCourse,getUserCoursebyAccountId} = require('../controllers/user_course.controllers')


router.get('/',getAllUserCourse)

router.get('/myclass',restrict,getUserCoursebyAccountId)


module.exports = router;