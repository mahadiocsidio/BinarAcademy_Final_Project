const router = require('express').Router();
const { verify } = require('jsonwebtoken');
const { register, login, verifyOtp, resendOtp , updateOtp, resetPassword,changePassword,whoami } = require('../controllers/users.controllers');
const {  restrict } = require('../middlewares/auth.middlewares');

router.post('/register', register);
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post('/login', login);

//RESET PASSWORD
router.post('/reset-password',resetPassword) //need email get token form email
router.put('/reset-password',changePassword) //enter new password

router.get('/whoami', restrict, whoami);
module.exports = router;
