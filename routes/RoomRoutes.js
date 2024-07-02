const express = require('express');
const { saveRoomData, creatRoom, getRoomData, addUserToRoom, updateEditors, createRoomFile, getRoomFiles, fetchRoomEditor, updateRoomReqst, updateEditorVersion, downloadRoomFiles,
    acceptRoomReqst, rejectRoomReqst
 } = require('../controller/roomController');
const router = express.Router();
const validateUserInfo = require('../middelware/validateUser');
const roomAuthentication = require('../middelware/roomAuthentication');

router.get('/', (req, res) => {
    res.json({ message: "hello" });
});

// Route to save data to a room
router.post('/saveData', saveRoomData); 
// This route handles saving data to a room

// Route to create a new room
router.post('/createRoom', validateUserInfo, creatRoom); 
// This route validates user information before creating a new room

// Route to upload files to a specific room
router.post('/:roomId/files', validateUserInfo, roomAuthentication, createRoomFile); 
// This route validates user information and room authentication before uploading files to a room

// Route to get files from a specific room and parent directory
router.get('/:roomId/files/:parentId', validateUserInfo, roomAuthentication, getRoomFiles); 
// This route validates user information and room authentication before fetching files from a room's specific directory

// Route to fetch the editor of a specific room
router.get('/getRoomEditor/:id', fetchRoomEditor); 
// This route fetches the editor details of a specific room

// Route to update the editors of a specific room
router.post('/updateRoomEditors/:id', updateEditors); 
// This route updates the editor details of a specific room

// Route to get data from a specific room
router.get('/:roomId', validateUserInfo, roomAuthentication, getRoomData); 
// This route validates user information and room authentication before fetching data from a room

// Route to add a user to a specific room
router.patch('/:id', addUserToRoom); 
// This route handles adding a user to a room

router.patch('/sendRqst/:roomCode', validateUserInfo, updateRoomReqst)
router.patch('/rqst/:roomId/accept', acceptRoomReqst)
router.patch('/rqst/:roomId/reject', rejectRoomReqst)


router.patch('/updateRoomEditors/version/:id', updateEditorVersion)

router.get('/download/:roomId', downloadRoomFiles)


module.exports = router;
