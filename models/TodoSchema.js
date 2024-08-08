const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    done: {
        type: Boolean,
        default: false,
    },
    roomAddress:{
        type: String,
    },
    from: {
        type: String,
    },
}, { timestamps: true });

const TodoInfo = mongoose.model('TodoInfo', todoSchema);
module.exports =  TodoInfo;