import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender, getCompleteSender } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider'
import ChatScroll from './ChatScroll';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';
import './styles.css';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';

const ENDPOINT = "http://localhost:5000";

var socket, selectedChatCompare;

const SingleChat = () => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();


    const defaultOptions = {
        loop: true,
        autoPlay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)

            //console.log(messages);
            setMessages(data);
            setLoading(false);

            //creating a new room with the selected chatId
            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to fetch messages!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, [])

    useEffect(() => {
        fetchMessages();

        //selectedChatCompare is backup for selected chat to check whether we need to send a message as chat or notification
        selectedChatCompare = selectedChat;

    }, [selectedChat]);


    useEffect(() => {
        //monitors the "message recieved" room to look for any updates 
        socket.on('message recieved', (newMsg) => {
            if (!selectedChatCompare || (selectedChatCompare._id !== newMsg.chat._id)) {
                //give notification
            } else {
                setMessages([...messages, newMsg]);
            }
        })
    })

    const sendMessage = async (e) => {

        if (e.key === "Enter" && newMessage) {

            socket.emit('stop typing', selectedChat._id);

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                }

                setNewMessage("");
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);

                console.log(data);
                socket.emit('send message', data);
                setMessages([...messages, data]);

            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send message!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        //Typing indicator logic
        if (!socketConnected) return;

        //on key down and setting the new message above, show typing 
        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        //when user is not typing, for how log the typing animation should last
        let lastTypingTime = new Date().getTime();
        var timeLength = 3000;

        //throttle function
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            //when time difference is exhausted and user not typing but animation is on then stop typing
            if (timeDiff >= timeLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timeLength);
    }

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
                                <UpdateGroupChatModel fetchMessages={fetchMessages} />
                            </>
                        )}
                    </Text>
                    <Box
                        display={"flex"}
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius={"lg"}
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size={"xl"}
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin={"auto"}
                            />) : (
                            <div className='messages'>
                                <ChatScroll messages={messages} />
                            </div>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired mt={3} >
                            {isTyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>

                            ) : (<></>)}
                            <Input
                                variant={"filled"}
                                bg="#E0E0E0"
                                placeholder='Enter a message...'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
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