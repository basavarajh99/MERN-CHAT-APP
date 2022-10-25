const jwt = require('jsonwebtoken');

//signing the token with unique user id and other parameters like secret key and life-span of token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = generateToken;