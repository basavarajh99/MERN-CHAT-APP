const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const generateToken = require('../config/generateToken');

//wrap the controller function in asyncHandler to handle errors automatically

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, picture } = req.body;

    if (!name || !email || !password) { //pic is optional
        res.status(400);
        throw new Error("Please enter all the feilds");
    }


    //if user exists in db already, then throw error
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists!");
    }

    //creating new user
    const user = await User.create({ name, email, password, picture });

    //If user creation is successfull, send a JWT token
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id)
        });
    } else { //user creation failed
        res.status(400);
        throw new Error("Failed to create new user");
    }
});


const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //check if user exists in DB
    const userExists = await User.findOne({ email });

    //if user found and password matches then send the details
    if (userExists && (await userExists.matchPassword(password))) {//matchPassword and password protection are defined in Usermodel
        res.status(201).json({
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            picture: userExists.picture,
            token: generateToken(userExists._id)
        });
    } else { //user authorization failed
        res.status(400);
        throw new Error("Invalid Email or Password");
    }
})

//we can send data to the backend using POST request which will be stored in req.body or we can user queries in URL like the
//following URL.

// /api/user?search=value

const searchUsers = asyncHandler(async (req, res) => {
    //use of $or operation from mongoDB to check for atleast one expression (in our case name or email) 
    //to be satisfied in the array of expressions  
    const keyword = req.query.search ? {
        $or: [
            //$regex: Provides regular expression capabilities for pattern matching strings in queries
            //$options: case sensitive or other flags
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};
    //console.log(keyword);

    //query the ketword in db

    //we want to find all the users that are part of the serach query except the one who is searching 
    //so use $ne(not equal) parameter from mongoDB to satisfy that condition
    //the current user can be retrieved using "req.user._id"
    console.log(req.user._id);
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    //.find({ _id: { $ne: req.user._id } }); //we need user to be logged in for this to work and provide the JWT
    //console.log(users);
    res.send(users);
})

module.exports = { registerUser, authUser, searchUsers };