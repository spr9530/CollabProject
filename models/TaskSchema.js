const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskName: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    taskStep: [
        {
            taskName: {
                type: String,
                required: true
            },
            taskDescription: {
                type: String,
                required: true
            },
            done: {
                type: Boolean,
                default: false
            }
        }
    ],
    taskRoom:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'RoomInfo',
        required: true,
    },
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'UserInfo',
            required: true,
        }
    ],
    taskDate:{
        type:String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TaskInfo = mongoose.model('TaskInfo', taskSchema)

module.exports = TaskInfo