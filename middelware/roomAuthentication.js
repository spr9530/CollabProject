const RoomInfo = require("../models/RoomSchema");

const roomAuthentication = async (req, res, next) => {
    try {
        const user = req.user;
        const { roomId } = req.params;

        // Fetch room information from the database
        const roomInfo = await RoomInfo.findOne({ _id: roomId });

        if (!roomInfo) {
            return res.status(404).json({ error: "Room not found" });
        }

        // Check if the user exists in the room's user list
        const userExist = roomInfo.users.some(roomUser => roomUser.userId.toString() === user.userId.toString());

        if (!userExist) {
            return res.status(403).json({ error: "User not authorized to access this room" });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in room authentication:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = roomAuthentication;

