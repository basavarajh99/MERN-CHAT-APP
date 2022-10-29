import { Avatar, Box, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent
} from '@chakra-ui/react';

import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const navigate = useNavigate();

    const { user, setSelectedChat, chats, setChats } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Search field is empty!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
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




            //console.log(data); //gives all the users along with their details
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load search result",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });


        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('/api/chat', { userId }, config); //it will return the chat that is created

            //if the chat we created above already there in setChats context, then just append it
            if (chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data); //populate the selected chat with created chat
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: "Error in fetching chats!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    };

    return (
        <>
            <Box
                display={'flex'}
                justifyContent='space-between'
                alignItems={'center'}
                bg='white'
                w='100%'
                p='5px 10px 5px 10px'
                borderWidth={'5px'}>

                <Tooltip label="Search Users to chat" hasArrow placement='bottom-end' >
                    <Button variant={'ghost'} onClick={onOpen} >
                        <i className='fas fa-search' ></i>
                        <Text display={{ base: 'none', md: 'flex' }} >Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize={'2xl'} fontFamily="Work sans" >Chat-Mate</Text>
                <div>
                    <Menu>
                        <MenuButton p={1} >
                            <BellIcon fontSize={"2xl"} m={1} />
                        </MenuButton>
                        {/* <MenuList></MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                            <Avatar size={'sm'} cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user} >
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler} >Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"} >Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display={'flex'} pb={2} >
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}> Search</Button>
                        </Box>
                        {loading ? (<ChatLoading />) : (
                            searchResult?.map(user => (
                                <UserListItem key={user._id} user={user} handleFunc={() => accessChat(user._id)} />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display={"flex"} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer