export const getSender = (loggedUser, users) => {
    //return all the users except the looged in one
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

export const getCompleteSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}