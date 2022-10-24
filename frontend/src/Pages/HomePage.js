import React from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'

const HomePage = () => {
    return (
        <Container maxW='xl' centerContent >
            <Box d="flex" justifyContent="center" p={3} bg="#ecf0f1" w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px" >
                <Text fontSize='4xl' textAlign="center" fontFamily='Work Sans' color="black" >Chat-Mate</Text>
            </Box>
            <Box p={4} bg="#ecf0f1" w="100%" borderRadius="lg" borderWidth="1px">
                <Tabs variant='soft-rounded' colorScheme='blue'>
                    <TabList mb="1em">
                        <Tab width="50%" >Log in</Tab>
                        <Tab width="50%" >Sign up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>{<Login />}</TabPanel>
                        <TabPanel>{<Signup />}</TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage