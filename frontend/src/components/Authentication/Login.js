import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);

    const handleSubmit = () => { }

    return (
        <VStack spacing='5px'>
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
            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={handleSubmit}
            >
                Log In
            </Button>
            <Button
                colorScheme='orange'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={() => {
                    setEmail("guest@ex.com")
                    setPassword("1234")
                }}
            >
                Login as Guest
            </Button>
        </VStack>
    )
}

export default Login