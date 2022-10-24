const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    picture: {
        type: String,
        required: true,
        default: "https://pixabay.com/images/id-973460/"
    },
},
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userModel);

module.exports = User;