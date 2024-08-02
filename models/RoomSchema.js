const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  roomCode: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  users: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserInfo',
      required: true
    },
    role: {
      type: String,
      required: true
    }
  }],
  reqsts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserInfo',
      required: true
    }
  }],
  roomFiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileInfo',
  }]
}, { timestamps: true })

const RoomInfo = mongoose.model('RoomInfo', RoomSchema);

module.exports = RoomInfo;