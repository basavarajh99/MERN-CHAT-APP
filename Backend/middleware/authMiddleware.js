const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            //decode token id
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            //console.log(decodedToken);
            //find the user in DB using decode token and return without the password
            req.user = await User.findById(decodedToken.id).select("-password");
            //console.log(req.user);

            next();

        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized, token failed");
        }
    }


    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no JWT!");
    }
})

module.exports = { protect };