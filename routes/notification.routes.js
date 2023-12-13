const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllNotif,
  createNotifbyId,
  getNotifbyLogin,
  getNotifbyId,
  createNotifBroadcast,
} = require('../controllers/notification.controller');

router.get('/', getAllNotif); //DONE
router.post('/', createNotifbyId); //DONE

router.post('/broadcast', createNotifBroadcast); //DONE

// BY LOGIN
router.get('/myNotifications', restrict, getNotifbyLogin); //DONE

// BY ID
router.get('/:notifikasi_id', getNotifbyId); // DONE

module.exports = router;
