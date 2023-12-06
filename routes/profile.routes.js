const express = require('express');
const router = express.Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllAccountProfile,
  getAccountbyId,
  updateProfilebyId,
  changePasswordbyLogin,
  logout,getAccountbyLogin,updateProfileByLogin,getRiwayatPembayaran
} = require('../controllers/profile.controllers');

router.get('/', getAllAccountProfile); //DONE

//BY LOGIN
router.get('/account', restrict, getAccountbyLogin); //DONE
router.put('/updateProfile', restrict, updateProfileByLogin); //DONE
router.put('/changePassword', restrict, changePasswordbyLogin); //DONE
router.get('/paymentHistory',restrict,getRiwayatPembayaran) //DONE

//BY ID
router.get('/:account_id', getAccountbyId); //DONE
router.put('/:account_id', updateProfilebyId); //DONE
router.post('/logout', logout);

module.exports = router;
