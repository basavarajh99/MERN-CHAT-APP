const asyncHandler = require('express-async-handler');
const Chat = require('../Models/chatModel');
const User = require('../Models/userModel');

//one on one chat
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    //we check whether user with userId exists then return the chat or else create chat with that userId
    if (!userId) {
        console.log("UserId not sent with request!");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } }, //current user logged in, sender
            { users: { $elemMatch: { $eq: userId } } }, //userId requested from URL, receiver
        ]
    })

        .populate("users", "-password") //Since user array has only user id initially populate the user with all the information except the password
        .populate("latestMessage"); //then populate everything related to latestMessage since it has only message id initially. 

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender", //latestMessage inside chatModel is referrancing to messageModel which has sender, so populate the sender with name pic and email
        select: "name pic email" //things that will be sent
    });

    //since it's a one on one chat we'll send only first element of the array, since there exists only one chat with above two user ids.
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else { //create chat with userId if it doesn't exist with both sender and receiver as users respectively
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            //create chat inside mongoDB
            const createdChat = await Chat.create(chatData);

            //find the chat created matching it with requested id and send it to user
            const chatHistory = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");

            res.status(200).send(chatHistory);
        } catch (error) {
            res.status(400);
            throw new Error(error);
        }
    }
})

module.exports = { accessChat }