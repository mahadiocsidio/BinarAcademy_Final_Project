const router = require('express').Router();
const { register, login, updateOtp } = require('../controllers/users.controllers');
const {  restrict } = require('../middlewares/auth.middlewares');

router.post('/register', register);
router.post('/login', login);



module.exports = router;
