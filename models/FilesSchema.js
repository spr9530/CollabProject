const mongoose = require('mongoose');

const Schema = mongoose.Schema

const fileSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        deafult: null,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    roomData:{
        type: String,
        default: null,
    },
    version:{
        type: Number,
        default: 1,
    },
    history: [
        {
            version: {
                type: Number,
                required: true,
            },
            data: {
                type: String,
                required: true,
            },
            date:{
                type: Date,
                default: Date.now,
            }
        },
    ],
    path: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const FileInfo = mongoose.model('FileInfo', fileSchema)

module.exports = FileInfo