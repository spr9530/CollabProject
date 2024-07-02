const express = require('express');
const { roomJoin } = require('../controller/notificationController');
const router = express.Router();

router.post('/roomJoin',roomJoin)

module.exports = router;
