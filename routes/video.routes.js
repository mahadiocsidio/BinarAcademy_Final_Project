const express = require('express');
const router = express.Router();
const { restrict } = require('../middlewares/auth.middlewares');
const {
  getAllVideo,
  createVideo,
  getVideobyId,
} = require('../controllers/video.controller');

router.get('/', getAllVideo);
router.post('/', createVideo);

// BY LOGIN

// BY ID
router.get('/:video_id', getVideobyId);

module.exports = router;
