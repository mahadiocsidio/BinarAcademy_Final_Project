const express = require('express')
const router = express.Router()
const {restrict} = require('../middlewares/auth.middlewares')
const {getAllAccountProfile,getAccountbyId,updateProfile,changePassword,logout} = require('../controllers/profile.controllers')

router.get('/', getAllAccountProfile)
router.get('/account',restrict, getAccountbyId)
router.put('/updateProfile',restrict, updateProfile)
router.put('/changePassword',restrict,changePassword)
router.post('/logout',logout)

module.exports=router