const express = require('express')
const router = express.Router()
const {restrict} = require('../middlewares/auth.middlewares')
const {getAllAccountProfile,getAccountbyId,updateProfile,changePassword,logout} = require('../controllers/profile.controllers')

router.get('/', getAllAccountProfile) //DONE

//BY LOGIN
router.get('/account',restrict, getAccountbyId)
router.put('/updateProfile',restrict, updateProfile)
router.put('/changePassword',restrict,changePassword) //DONE

//BY ID
router.get('/:account_id',getAccountbyId) //DONE
router.put('/:account_id', updateProfile) //DONE
router.post('/logout',logout)

module.exports=router