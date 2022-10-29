import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

const ChatScroll = ({ messages }) => {

    const { user } = ChatState();

    return (
        <ScrollableFeed>{
            messages && messages.map((msg, idx) => (
                <div style={{ display: "flex" }} key={msg._id}>
                    {(isSameSender(messages, msg, idx, user._id) || isLastMessage(messages, idx, user._id)) && (
                        <Tooltip
                            label={msg.sender.name}
                            placement="bottom-start"
                            hasArrow
                        >
                            <Avatar
                                mt={"7px"}
                                mr={1}
                                size="sm"
                                cursor={"pointer"}
                                name={msg.sender.name}
                                src={msg.sender.picture}
                            />
                        </Tooltip>
                    )}
                    <span
                        style={{
                            backgroundColor: `${msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, msg, idx, user._id),
                            marginTop: isSameUser(messages, msg, idx) ? 3 : 10,
                        }}
                    >
                        {msg.content}
                    </span>
                </div>
            ))
        }</ScrollableFeed>
    )
}

export default ChatScroll