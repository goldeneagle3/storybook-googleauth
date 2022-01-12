const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const userCtrl = require('./../controllers/user.controller');

router.route('/').get(ensureGuest, userCtrl.loginPage);

router.route('/dashboard').get(ensureAuth, userCtrl.dashboard);

module.exports = router;
