const express = require("express");
// const chats = require("./Data/data");
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();
const app = express();

//since we will be recieving data from frontend, we need to tell backend to accept it.
app.use(express.json());

//home page
app.get("/", (req, res) => {
    res.send("API is running successfully!");
})

/* 

    //to fetch all the chats
    app.get("/api/chat", (req, res) => {
        res.send(chats);
    });
    
    //to get a specific chat
    app.get("/api/chat/:id", (req, res) => {
        const singleChat = chats.find((c) => c._id === req.params.id);
        res.send(singleChat);
    })
    
    
*/

//users end-points

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

//error handling functions incase of failed to login or notfound
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, console.log(`Server listening to PORT number ${PORT}`));


//pingTimeout is the amount of time socket remailns active before going off to save bandwidth
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io!!!");

    //everytime users open the app, they should be connected to their own socket
    //when we recieve data from the frontend we create a socket and join the room
    socket.on('setup', (userData) => {
        //creating the new room with id of user data and that room will be exclusive that particular user only
        socket.join(userData._id);
        //console.log(userData._id);
        socket.emit('connected');
    });

    //joining the chat
    //when we click on a chat this should create a new room with both the if they both are present, else one who joins will be 
    //added and other will joined when he becomes active
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User Joined Room: ' + room);
    });

    //socket for typing
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    //socket for sending message
    socket.on('send message', (newMsg) => {
        //check which chat room the chat belongs to
        var chat = newMsg.chat;

        if (!chat.users) return console.log('Chat.users is not defined!');

        //emit the message to all except the sender
        chat.users.forEach(user => {
            //sender
            if (user._id == newMsg.sender._id) return;

            socket.in(user._id).emit('message recieved', newMsg);
        })
    })

    socket.off('setup', () => {
        console.log("USER DISCONNECTED!");
        socket.leave(userData._id);
    })
})