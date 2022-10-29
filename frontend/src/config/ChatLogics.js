export const getSender = (loggedUser, users) => {
    //return all the users except the looged in one
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

export const getCompleteSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}

//isSameSender = all message, current message, index of current message and userId of logged in user
export const isSameSender = (messages, cur_msg, idx_msg, userId) => {
    return (

        //if the current message index doesn't exceeed the total meesages length,
        //next message sent is not equal to the current sender and 
        // current message is not by the userId
        (idx_msg < messages.length - 1) &&
        (messages[idx_msg + 1].sender._id !== cur_msg.sender._id || messages[idx_msg + 1].sender._id === undefined)
        && (messages[idx_msg].sender._id !== userId)
    );
}

export const isLastMessage = (messages, idx_msg, userId) => {
    return (
        (idx_msg === messages.length - 1) && (messages[messages.length - 1].sender._id !== userId) &&
        (messages[messages.length - 1].sender._id)
    );
}

export const isSameSenderMargin = (messages, cur_msg, idx_msg, userId) => {
    if ((idx_msg < messages.length - 1) && (messages[idx_msg + 1].sender._id === cur_msg.sender._id) &&
        (messages[idx_msg].sender._id !== userId)) return 33;

    else if (((idx_msg < messages.length - 1) && (messages[idx_msg + 1].sender._id !== cur_msg.sender._id)) &&
        ((messages[idx_msg].sender._id !== userId) ||
            ((idx_msg === messages.length - 1) && messages[idx_msg].sender._id !== userId))) return 0;

    else return "auto";
};

export const isSameUser = (messages, cur_msg, idx_msg) => {
    return (idx_msg > 0) && (messages[idx_msg - 1].sender._id === cur_msg.sender._id);
}