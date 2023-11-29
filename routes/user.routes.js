const router = require('express').Router();
const { verify } = require('jsonwebtoken');
const { register, login, verifyOtp, resendOtp , updateOtp } = require('../controllers/users.controllers');
const {  restrict } = require('../middlewares/auth.middlewares');

router.post('/register', register);
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post('/login', login);



module.exports = router;
