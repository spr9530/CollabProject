const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomCode:{
        type:String,
        required: true,
    },
    roomName:{
        type:String,
        required: true,
    },
    users:[{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref:'UserInfo',
          required: true 
        },
        role: {
          type: String,
          required: true 
        }
      }],
    reqsts:[{
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserInfo',
        required: true 
      }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const RoomInfo = mongoose.model('RoomInfo', RoomSchema);

module.exports = RoomInfo;