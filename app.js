const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./database/connectDB')
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { ExpressPeerServer } = require('peer');
const Pusher = require('pusher');


const pusher = new Pusher({
    appId: "1827027",
    key: "0a8370d6d5a42543bf95",
    secret: "9c22a60950a519f96de7",
    cluster: "ap2",
    useTLS: true
  });


connectDB()

const app = express();
const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
    debug: true,
});


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/app/v1/room', require('./routes/RoomRoutes'))
app.use('/app/v1/todo', require('./routes/TodoRoutes'))
app.use('/app/v1/task', require('./routes/TaskRoute'))
app.use('/app/v1/user', require('./routes/UserRoutes'))
app.use('/app/v1/room/meeting', peerServer);

app.post('/pusher/trigger', (req, res) => {
    const { channel, event, message, socketId } = req.body;

    pusher.trigger(channel, event, { message }, { socket_id: socketId })
        .then(() => {
            console.log(socketId)
            res.status(200).send('Event triggered successfully');
        })
        .catch(error => {
            res.status(500).send('Error triggering event: ' + error.message);
        });
});

app.post('/signal', (req, res) => {
    const { to, from, data } = req.body;
    pusher.trigger(to, 'signal', { from, data });
    res.sendStatus(200);
});




const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
