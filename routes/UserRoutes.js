const express = require('express');
const { checkUser, userLoggin, getUserInfo, updateUserInfo, checkUserName, sendOtp, verifyOtp, addUser } = require('../controller/userController');
const validateUserInfo = require('../middelware/validateUser');

const router = express.Router();

router.post('/checkUser', checkUser)
router.get('/usernames', checkUserName)
router.post('/otp', sendOtp)
router.post('/otp/verify', verifyOtp)
router.post('/logginUser', userLoggin)
router.post('/addUser', addUser)
router.patch('/updateUser', validateUserInfo, updateUserInfo)
router.get('/getUserInfo', validateUserInfo, getUserInfo)

module.exports = router;