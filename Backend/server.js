const express = require("express");
const chats = require("./Data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
connectDB();

//home page
app.get("/", (req, res) => {
    res.send("API is running successfully!");
})

//to fetch all the chats
app.get("/api/chat", (req, res) => {
    res.send(chats);
});

//to get a specific chat
app.get("/api/chat/:id", (req, res) => {
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat);
})

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server listening to PORT number ${PORT}`));