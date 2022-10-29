const { response } = require('express');
const asyncHandler = require('express-async-handler');
const Chat = require('../Models/chatModel');
const Message = require('../Models/messageModel');
const User = require('../Models/userModel');

const sendMessage = asyncHandler(async (req, res) => {
    //chatId of the message to which message is to be sent, message itself and sender of the message
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid Data passed!");
        return res.sendStatus(400);
    }

    //create the new message
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage); //save new message in db

        //populate the message and sender with pic
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        });

        //update the latest message
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const chatHistory = asyncHandler(async (req, res) => {
    try {
        //chatId is in url now so use params
        const message = await Message.find({ chat: req.params.chatId }).populate(
            "sender", "name pic email"
        ).populate("chat");

        res.json(message);

    } catch (error) {
        res.sendStatus(400);
        return new Error(error.message);
    }
})

module.exports = { sendMessage, chatHistory };