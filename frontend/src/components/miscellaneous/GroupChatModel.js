import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const GroupChatModel = ({ children }) => {

    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]); //results from api fetch
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    //After we create a group chat we are gonna append it to the list of chats

    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            //console.log(data);
            setSearchResults(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })

            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(user => user._id))
            }, config);

            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        } catch (error) {
            toast({
                title: "Failed to create group!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    };

    const handleDelete = (userDel) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userDel._id))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User Already Exists!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            })

            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"Work sans"}
                        display="flex"
                        justifyContent={"center"}
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDir="column"
                        alignItems={"center"}
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box
                            w="100%"
                            display={"flex"}
                            flexWrap="wrap"
                        >
                            {selectedUsers.map(user => (
                                <UserBadgeItem key={user._id} user={user} handleFunc={() => handleDelete(user)} />
                            ))}
                        </Box>
                        {loading ? <Spinner size={"lg"} /> : searchResults?.slice(0, 5).map(user => (
                            <UserListItem user={user} key={user._id} handleFunc={() => handleGroup(user)} />
                        ))}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModel