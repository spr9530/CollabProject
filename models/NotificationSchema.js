const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    roomCode:{
        type:String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    }
});

const NotificationInfo = mongoose.model('NotificationInfo', notificationSchema);
module.exports = NotificationInfo;
