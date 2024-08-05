const express = require('express');
const { createTask, getRoomTask, updateTask, getOneTask, deleteTask, getAllTask } = require('../controller/taskController');

const router = express.Router()

router.get('/allTask/:id', getRoomTask)
router.get('/allTask/user/:id', getAllTask)
router.get('/userTask/:id1/:id2', getOneTask)
router.post('/createTask/:id1/:id2', createTask, getOneTask)
router.delete('/deleteTask/:taskId/:id1/:id2', deleteTask, getOneTask)
router.patch('/updateTaskStep/:taskId/:id1/:id2', updateTask, getOneTask) //user is allowed or not 

module.exports = router;