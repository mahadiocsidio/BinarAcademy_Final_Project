const express = require('express')
const router = express.Router()
const {getAllAccount,getUserbyId,updateProfile} = require('../controllers/profile.controllers')

router.get('/', getAllAccount)
router.get('/:account_id',getUserbyId)
router.put('/updateProfile',updateProfile)

module.exports=router