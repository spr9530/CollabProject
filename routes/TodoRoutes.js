const express = require('express');
const { createTodo, getTodo, updateTodo, deleteTodo } = require('../controller/todoController');

const router = express.Router();

// Route to create a new todo
router.post('/', createTodo);

// Route to get all todos
router.get('/', (req, res)=>{
  res.send('hello');
});

// Route to update a todo by ID
router.put('/:id', updateTodo);

// Route to delete a todo by ID
router.delete('/:id', deleteTodo);

module.exports = router;
