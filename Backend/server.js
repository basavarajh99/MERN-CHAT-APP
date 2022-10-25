const express = require("express");
const chats = require("./Data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes.js');
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

//error handling functions incase of failed to login or notfound
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server listening to PORT number ${PORT}`));