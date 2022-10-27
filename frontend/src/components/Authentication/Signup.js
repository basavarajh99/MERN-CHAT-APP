import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [show, setShow] = useState(false);
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState();
    const toast = useToast();
    const navigate = useNavigate();

    const postDetails = (pics) => {
        setLoading(true);
        if (!pics) {
            toast({
                title: "Please upload an image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        //check for valid type of image and provide parameters to cloudinary and fetch the response
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-mate");
            data.append("cloud_name", "dllmudlwq");
            fetch("https://api.cloudinary.com/v1_1/dllmudlwq/image/upload", {
                method: 'post', body: data
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    }

    const handleSubmit = async () => {
        setLoading(true);

        //if form fill up is incomplete
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        //if password !== confirmPassword
        if (password !== confirmPassword) {
            toast({
                title: "Password and Confirm Password do not match!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        console.log(name, email, password, pic);
        //if everything is fine then send the data to db
        try {
            // const config = {
            //     headers: {
            //         "Content-type": "application/json",
            //     },
            // };
            //sending form data to signup url along with the headers 
            //console.log(axios.post("/api/user", { name, email, password, pic }));
            const { data } = await axios.post("/api/user",
                { name, email, password, pic }); //config passed as a paramter to post method
            console.log(data);
            toast({
                title: "Registration Successfull!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem('userInfo', JSON.stringify(data));

            setLoading(false);

            navigate("/chats");

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Enter Your password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width={"4.5rem"} >
                        <Button h={"1.75rem"} size="sm" onClick={() => setShow(!show)} >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size={"md"} >
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Confirm Your password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width={"4.5rem"} >
                        <Button h={"1.75rem"} size="sm" onClick={() => setShow(!show)} >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Upload your picture</FormLabel>
                <Input
                    type={"file"}
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])} //accepts only one image, first one
                />
            </FormControl>
            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={handleSubmit}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup