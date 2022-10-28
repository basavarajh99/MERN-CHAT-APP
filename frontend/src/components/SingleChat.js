import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, IconButton, Text } from '@chakra-ui/react';
import React from 'react'
import { getSender, getCompleteSender } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider'
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';

const SingleChat = () => {
    const { user, selectedChat, setSelectedChat } = ChatState();

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily={"Work sans"}
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />

                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModel user={getCompleteSender(user, selectedChat.users)} />
                            </>) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModel />
                            </>
                        )}
                    </Text>
                    <Box
                        display={"flex"}
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius={"lg"}
                        overflowY="hidden"
                    >
                        {/* Messages Here */}
                    </Box>
                </>) : (
                <Box
                    display={"flex"}
                    alignItems="center"
                    justifyContent={"center"}
                    h="100%"
                >
                    <Text
                        fontSize={"3xl"}
                        pb={3}
                        fontFamily="Work sans"
                    >
                        Click on a user to start chatting!
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat