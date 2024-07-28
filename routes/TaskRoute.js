const express = require('express');
const { createTask, getRoomTask, updateTask, getOneTask, deleteTask, getAllTask } = require('../controller/taskController');

const router = express.Router()

router.get('/allTask/:id', getRoomTask)
router.get('/allTask/user/:id', getAllTask)
router.get('/userTask/:id1/:id2', getOneTask)
router.post('/createTask', createTask)
router.delete('/deleteTask/:id', deleteTask)
router.patch('/updateTaskStep/:id', updateTask) //user is allowed or not 

module.exports = router;