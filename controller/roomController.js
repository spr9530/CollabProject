const FileInfo = require('../models/FilesSchema');
const RoomInfo = require('../models/RoomSchema');
const UserInfo = require('../models/UserSchema')
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const saveRoomData = async (req, res) => {
    const data = req.body;
    if (data) {
        try {
            const response = new RoomInfo(data);
            await response.save();
            console.log(response);
            res.status(201).json({ message: "Room data saved successfully", data: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to save room data" });
        }
    } else {
        res.status(400).json({ message: "No data provided" });
    }
};

const creatRoom = async (req, res) => {
    const data = req.body;
    if (data) {
        try {
            const roomCode = data.roomCode;
            const roomName = data.roomName;
            const userId = req.user.userId;

            const newRoom = new RoomInfo({
                roomCode,
                roomName,
                users: [{
                    userId,
                    role: 'Admin'
                }],
            })

            await newRoom.save();
            res.json({ roomInfo: newRoom })
        } catch (error) {
            res.json({ error: error })
        }
    } else {
        res.send('Data doesnt received')
    }
}

const getRoomData = async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        return res.status(400).json({ error: 'Room ID not found' });
    }

    try {
        // Find the room by ID
        const roomInfo = await RoomInfo.findOne({ _id: roomId });

        if (!roomInfo) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Populate the 'users.userId' and 'reqsts._id' paths
        await RoomInfo.populate(roomInfo, [
            { path: 'users.userId' },
            { path: 'reqsts.user' }
        ]);

        res.json({ roomInfo });

    } catch (error) {
        console.error('Error fetching room data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const addUserToRoom = async (req, res) => {
    const { id } = req.params;
    const { users } = req.body;

    try {

        const response = await RoomInfo.findOneAndUpdate(
            { roomCode: id },
            { $set: { users: users } },
            { new: true }
        );

        res.json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the room users.' }); // Respond with a generic error message
    }
}

const createRoomFile = async (req, res) => {

    const { name, type, roomId, path } = req.body;
    const parentId = req.body.parentId || null;
    try {
        const newFile = new FileInfo({
            name,
            type,
            parentId,
            roomId,
            path,
        });

        const savedFile = await newFile.save();
        res.status(201).json(savedFile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getRoomFiles = async (req, res) => {
    const { roomId, parentId } = req.params;
    let id = null
    if (parentId != 'root') {
        id = parentId
    }
    try {
        const fetchRoomFiles = await FileInfo.find({ roomId: roomId, parentId: id });
        if (!fetchRoomFiles) {
            return res.status(404).json({ error: 'Room files not found' });
        }
        if (fetchRoomFiles.length === 0) {
            return res.json({ error: 'No Files Created' });
        }

        res.json(fetchRoomFiles);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

const updateEditors = async (req, res) => {
    const { roomData } = req.body
    const { id } = req.params;
    try {
        if (!roomData && roomData != '') {
            res.status(501).json({ error: 'Data not Provided' })
        }

        const editor = await FileInfo.findOneAndUpdate({ _id: id }, { $set: { roomData: roomData } }, { new: true })
        res.json({ editor });

    } catch (error) {
        res.status(501).json({ error: error.message })
    }

}

const fetchRoomEditor = async (req, res) => {
    const { id } = req.params;

    try {

        const response = await FileInfo.findOne({ _id: id })

        res.json({ response })

    } catch (error) {
        res.status(501).json({ error: error.message })
    }
}

const updateRoomReqst = async (req, res) => {
    try {
        const user = req.body;
        const { roomCode } = req.params;

        // Find the room by ID and update the requests list
        const roomInfo = await RoomInfo.findOneAndUpdate(
            { roomCode: roomCode },
            { $push: { reqsts: { user: user } } }, // Use $push to add the user to the reqsts array
            { new: true } // Return the updated document
        );

        if (!roomInfo) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({ message: 'Request updated successfully', roomInfo });
    } catch (error) {
        console.error('Error updating room request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const acceptRoomReqst = async(req, res) =>{
    const {userId} = req.body;
    const {roomId} = req.params;
    try{

        const room = await RoomInfo.findOneAndUpdate(
            { _id: roomId }, 
            { 
                $push: { users: { userId: userId } },
                $pull: { reqsts: { 'user': userId } }
            },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const userUpdate = await UserInfo.findOneAndUpdate({_id: userId}, {$push:{rooms: room}}, {new:true})

        if(!userUpdate){
            return res.status(404).json({ error: 'Internal error' });
        }
        res.json(room);

    }catch (error) {
        console.error('Error accepting room request:', error);
        res.status(500).json({ error: 'Failed to accept room request' });
    }
}

const rejectRoomReqst = async (req, res) => {
    const { userId } = req.body;
    const { roomId } = req.params;

    try {
        const room = await RoomInfo.findOneAndUpdate(
            { _id: roomId }, 
            { $pull: { reqsts: { 'user': userId} } },
            { new: true } 
        );

        // Handle case if room is not found
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Respond with the updated room document

        res.json(room);
    } catch (error) {
        console.error('Error rejecting room request:', error);
        res.status(500).json({ error: 'Failed to reject room request' });
    }
};


const updateEditorVersion = async (req, res) => {
    const { version, data } = req.body;
    const { id } = req.params;

    try {
        // Check if data is provided
        if (!data && data !== '') {
            return res.status(400).json({ error: 'Data not provided' });
        }

        // Find the editor document and update its history array
        const oldVersion = await FileInfo.findOneAndUpdate(
            { _id: id },
            { $set: { version: (version + 1) } },
            { new: true }
        );
        const editor = await FileInfo.findOneAndUpdate(
            { _id: id },
            { $push: { history: { version, data } } },
            { new: true }
        );

        if (!editor) {
            return res.status(404).json({ error: 'Editor not found' });
        }

        // Return the updated editor document
        res.json(version + 1);
    } catch (error) {
        console.error('Error updating editor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const buildHierarchy = async (roomId, parentId = null) => {
    const files = await FileInfo.find({ roomId, parentId }).exec();
    return Promise.all(files.map(async (file) => {
        console.log(file._doc)
        if (file.type === 'folder') {
            return {
                ...file._doc,
                contents: await buildHierarchy(roomId, file._id)
            };
        }
        return file._doc;
    }));
};

const downloadRoomFiles = async (req, res) => {

    const { roomId } = req.params;

    try {

        const rootFilesAndFolders = await buildHierarchy(roomId);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Compression level
        });
        const zipFilename = `room_${roomId}_structure.zip`;
        res.attachment(zipFilename);
        archive.pipe(res);

        const addFilesToArchive = (folderPath, files) => {
            files.forEach(file => {
                if (file.type === 'folder') {
                    const newFolderPath = path.join(folderPath, file.name);
                    archive.append(null, { name: newFolderPath + '/' });
                    addFilesToArchive(newFolderPath, file.contents);
                } else {
                    archive.append(file.roomData || '', { name: path.join(folderPath, file.name) });
                }
            });
        };

        addFilesToArchive('', rootFilesAndFolders);

        archive.finalize();


    } catch (error) {
        console.error("Error fetching room data:", error);
        res.status(500).send('Internal Server Error');
    }
}



module.exports = { saveRoomData, creatRoom, getRoomData, addUserToRoom, updateEditors, createRoomFile, getRoomFiles, fetchRoomEditor, updateRoomReqst, updateEditorVersion, downloadRoomFiles,
    acceptRoomReqst, rejectRoomReqst
 };
