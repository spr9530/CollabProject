const TodoInfo = require("../models/TodoSchema");

// Function to create a new todo
const createTodo = async (req, res) => {
    const { taskName, taskDate, taskDescription = "", from = 'Self', roomAddress="" } = req.body;

    try {
        const newTodo = new TodoInfo({
            name: taskName,
            date: taskDate,
            description: taskDescription,
            from,
            roomAddress
        });

        await newTodo.save();
        const newTodos = await TodoInfo.find();
        res.status(200).json(newTodos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
// Function to retrieve all todos
const getTodo = async (req, res) => {
    try {
        const todos = await TodoInfo.find();
        res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Function to update a todo by ID
const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { taskName, taskDate, taskDescription, from, done } = req.body;

    try {
        const updatedTodo = await TodoInfo.findByIdAndUpdate(id, {
            name: taskName,
            date: taskDate,
            done: done,
            description: taskDescription,
            from
        }, { new: true });

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        const todos = await TodoInfo.find();
        res.status(200).json(todos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Function to delete a todo by ID
const deleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTodo = await TodoInfo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        const newTodos = await TodoInfo.find();
        res.status(200).json(newTodos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

module.exports = { createTodo, getTodo, updateTodo, deleteTodo };
