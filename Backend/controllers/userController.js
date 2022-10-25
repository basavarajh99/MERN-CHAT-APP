const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const generateToken = require('../config/generateToken');

//wrap the controller function in asyncHandler to handle errors automatically

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

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
    const user = await User.create({ name, email, password, pic });

    //If user creation is successfull, send a JWT token
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
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
            pic: userExists.pic,
            token: generateToken(userExists._id)
        });
    } else { //user authorization failed
        res.status(400);
        throw new Error("Invalid Email or Password");
    }
})

module.exports = { registerUser, authUser };