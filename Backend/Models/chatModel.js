//chatName, isGroupChat, listOfUsers, latestMessage, groupAdmin

const mongoose = require('mongoose');

const chatModel = mongoose.Schema({
    chatName: { type: String, trim: true }, //trimming spaces

    isGroupChat: { type: Boolean, default: false }, //By default it's a individual chat

    users: [{ //single chat gonna have 2 users and group chat > 2, so users array
        type: mongoose.Schema.Types.ObjectId, //Id of a particular user
        ref: "User" //referance to User Model
    }],

    latestMessage: {
        type: mongoose.Schema.Types.ObjectId, //Id of a particular message to keep latest message on-screen below username
        ref: "Message" //referance to Message Model
    },

    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId, //Id of a particular user
        ref: "User" //referance to User Model
    }
},
    {
        timestamps: true, //everytime a new chat is added unique timestamp is created
    }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;