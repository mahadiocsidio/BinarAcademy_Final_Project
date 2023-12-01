const express = require('express')
const router = express.Router()
const {restrict} = require('../middlewares/auth.middlewares')
const {getAllAccount,getAccountbyId,updateProfile,changePassword,logout} = require('../controllers/profile.controllers')

router.get('/', getAllAccount)
router.get('/:account_id',getAccountbyId)
router.put('/updateProfile',restrict, updateProfile)
router.put('/changePassword',restrict,changePassword)
router.post('/logout',logout)

module.exports=router