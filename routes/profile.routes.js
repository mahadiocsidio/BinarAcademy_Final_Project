const express = require('express')
const router = express.Router()
const {getUserbyId,updateProfile} = require('../controllers/profile.controllers')

router.get('/profile',getUserbyId)
router.post('/updateProfile',updateProfile)

module.exports=router