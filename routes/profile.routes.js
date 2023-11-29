const express = require('express')
const router = express.Router()
const {getAllAccount,getAccountbyId,updateProfile} = require('../controllers/profile.controllers')

router.get('/', getAllAccount)
router.get('/:account_id',getAccountbyId)
router.put('/updateProfile',updateProfile)

module.exports=router