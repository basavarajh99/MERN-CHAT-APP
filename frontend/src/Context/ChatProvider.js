import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";


const ChatContext = createContext();

//ChatProvider wraps the whole app

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(); //this will be passed into chatcontext.provider and will be available everywher throughout the app
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [fetchAgain, setFetchAgain] = useState(false)

    const navigate = useNavigate();

    //fetch userInfo frm localstorage and parse it to JSON from stringify fromat

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        //set the user info
        setUser(userInfo);

        //if user is not logged in then redirect to login page
        if (!userInfo) {
            navigate("/", { replace: true });
        }
    }, [navigate])


    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setFetchAgain }}>
            {children}
        </ChatContext.Provider>
    )
};

//all of the state is inside ChatState now
export const ChatState = () => {

    return useContext(ChatContext);
}

export default ChatProvider;