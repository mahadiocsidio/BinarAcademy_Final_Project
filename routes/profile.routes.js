const express = require('express')
const router = express.Router()
const {restrict} = require('../middlewares/auth.middlewares')
const {getAllAccountProfile,getAccountbyId,getAccountbyLogin,updateProfile,updateProfilebyLogin,changePasswordbyLogin,logout,getRiwayatPembayaran} = require('../controllers/profile.controllers')

router.get('/', getAllAccountProfile) //DONE

//BY LOGIN
router.get('/account',restrict, getAccountbyLogin)
router.put('/updateProfile',restrict, updateProfilebyLogin)
router.put('/changePassword',restrict,changePasswordbyLogin)
router.get('/riwayat', restrict,getRiwayatPembayaran) //DONE

//BY ID
router.get('/:account_id',getAccountbyId) //DONE
router.put('/:account_id', updateProfile) //DONE
router.post('/logout',logout)

module.exports=router