const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomCodeSchema = new Schema({
    code:{
        type: String,
        required: true,
    }
}, { timestamps: true })

const RoomCodeInfo = mongoose.model('RoomCodeInfo', RoomCodeSchema)
module.exports =  RoomCodeInfo