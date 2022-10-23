import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ChatPage = () => {
    const [chats, setChats] = useState([]); //to store chats from api call

    const fetchChats = async () => {
        const { data } = await axios.get('/api/chat');

        setChats(data);
        // console.log(data); //logs all the chat data
    }

    //whenever the component is rendered the functio will be called
    useEffect(() => {
        fetchChats();
    }, [])


    return (
        <div>{chats.map(chat => <div key={chat._id}>{chat.chatName}</div>)}</div>
    )
}

export default ChatPage