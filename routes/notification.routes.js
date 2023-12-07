const router = require('express').Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllNotif,
  createNotif,
  getNotifbyAccountId,
  getNotifById,
} = require('../controllers/notification.controller');

router.get('/', getAllNotif);
router.post('/', createNotif);

// BY LOGIN
router.get('/myNotifications', restrict, getNotifbyAccountId);

// BY ID
router.get('/:notification_id', getNotifById);

module.exports = router;
