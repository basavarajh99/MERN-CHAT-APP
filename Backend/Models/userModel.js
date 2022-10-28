const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    picture: {
        type: String,
        default: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-512.png"
    },
},
    {
        timestamps: true
    }
);

//method for verification of password
userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Before saving user, execute password protection middleware which uses bcrypt for hashing and salting
userModel.pre('save', async function (next) {
    //if the current password is not modified move-on to next() i.e, don't run code after it
    if (!this.isModified) {
        next();
    }

    //the higher the salt number, more secured password
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userModel);

module.exports = User;