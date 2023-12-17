const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllNotif,
  createNotifbyId,
  getNotifbyLogin,
  getNotifbyId,
  createNotifBroadcast,
} = require('../controllers/notification.controller');

router.get('/', getAllNotif);
router.post('/', createNotifbyId);

router.post('/broadcast', createNotifBroadcast);

// BY LOGIN
router.get('/myNotifications', restrict, getNotifbyLogin);

// BY ID
router.get('/:notifikasi_id', getNotifbyId);

module.exports = router;
