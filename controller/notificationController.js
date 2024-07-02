const NotificationInfo = require("../models/NotificationSchema")

const roomJoin= async (req, res) => {

    const userInfo = req.body;

    try {

        const notification = new NotificationInfo({
            subject: 'A user want to join',
            message: `${userInfo.userName} wants to join the room`,
            roomCode: userInfo.code,
        })

        notification.save();

        res.json(notification)

    } catch (error) {
        res.status(501).json({ error: error.message })
    }
}

module.exports = {roomJoin}