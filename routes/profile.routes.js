const express = require('express')
const router = express.Router()
const {restrict} = require('../middlewares/auth.middlewares')
const {getAllAccount,getAccountbyId,updateProfile,changePassword,logout} = require('../controllers/profile.controllers')

router.get('/', getAllAccount)
router.put('/changePassword',restrict,changePassword)
router.get('/:account_id',getAccountbyId)
router.put('/:account_id', updateProfile)
router.post('/logout',logout)

module.exports=router