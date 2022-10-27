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

const fetchChats = asyncHandler(async (req, res) => {

    //just check which user is logged in and return his chats
    try {
        //without poplating array it return only the id of end to end users
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) //.then(result => res.send(result))
            .populate("users", "-password") //populating users
            .populate("groupAdmin", "-password") //populating whether group admins
            .populate("latestMessage") //populating latest message
            .sort({ updatedAt: -1 }) //sorting from new to old
            .then(async (result) => { //populating receiver 
                result = await User.populate(result, {
                    path: "latestMessage.sender", //latestMessage inside chatModel is referrancing to messageModel which has sender, so populate the sender with name pic and email
                    select: "name pic email" //things that will be sent
                });

                res.status(200).send(result);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }


})


const createGroupChat = asyncHandler(async (req, res) => {
    //we take bunch of users and groupname
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please enter users and group name." });
    }

    //We send data as a string from frontend to backend and in the backend we need to parse it
    var users = JSON.parse(req.body.users);

    //more than two users are required for group chat
    if (users.length < 2) {
        return res.status(400).send("Add more than 2 users to a group");
    }

    //add current logged in user to the group
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        //find the group chat formed in the db and send it to user
        const formedGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(formedGroupChat);
    } catch (error) {
        res.status(400);
        return new Error(error);
    }
})

module.exports = { accessChat, fetchChats, createGroupChat }