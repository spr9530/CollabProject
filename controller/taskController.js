const TaskInfo = require("../models/TaskSchema");

const createTask = async (req, res, next) => {
    try {
        const { taskName, taskDescription, taskStep, taskRoom, users, taskDate } = req.body;
        const task = await TaskInfo({
            taskName,
            taskDescription,
            taskStep,
            taskRoom,
            users,
            taskDate,
        })
        await task.save()
        next()
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }

}

const getRoomTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await TaskInfo.find({ taskRoom: id });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTask = async (req, res) => {
    const { id } = req.params;
    try {
        const tasks = await TaskInfo.find({ users : id }).populate('taskRoom');

        if (tasks.length === 0) {
            return res.status(404).json({ error: 'Not Found' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOneTask = async (req, res) => {
    const { id1, id2 } = req.params;
    try {

        const task = await TaskInfo.find({ taskRoom: id1 })

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const userTask = task.filter((task) => {
            return task.users.includes(id2);
        });


        res.json({ userTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateTask = async (req, res, next) => {
    const { taskId } = req.params;

    const {data} = req.body;
    try {

        const task = await TaskInfo.findOneAndUpdate({ _id: taskId }, { $set: data }, { new: true })

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        next()
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


}

const deleteTask = async (req, res, next) => {
    const { taskId } = req.params;
    console.log('hello')

    try {
        const task = await TaskInfo.findOneAndDelete({ _id: taskId });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        next();
    } catch (error) {
        res.status(501).json({ error: error.message })
    }
}


module.exports = { createTask, getRoomTask, updateTask, getOneTask, deleteTask, getAllTask }
