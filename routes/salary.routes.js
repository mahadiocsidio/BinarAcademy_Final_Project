const router = require('express').Router();
const {imageFilter} = require('../libs/multer');
const { restrict } = require('../middlewares/auth.middlewares');
const { getAllSalary } = require('../controllers/salary.controllers');
const { Router } = require('express');

router.get('/', getAllSalary);

module.exports = router
