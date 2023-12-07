const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllPayment,
  createPayment,
  getPaymentbyLogin,
  getPaymentById,
  createPaymentbyLogin,
} = require('../controllers/payment.controller');

router.get('/', getAllPayment);
router.post('/', createPayment);

// BY LOGIN
router.get('/checkout', restrict, getPaymentbyLogin);
router.post('/checkout', restrict, createPaymentbyLogin);

// BY ID
router.get('/:riwayat_transaksi_id', getPaymentById);

module.exports = router;
