import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';

import { Input, Button, Stack} from '@chakra-ui/react'
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger} from "../components/ui/dialog"
import { Field } from "../components/ui/field"
import { PasswordInput } from "../components/ui/password-input"

export default function Login(props){
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [invalidUsername, setInvalidUsername] = useState("");
    const [invalidPassword, setInvalidPassword] = useState("");

    async function loginFunction(){
        //Clear the system message.
        setInvalidUsername("");
        setInvalidPassword("");

        //Check to see if the username and password is empty.
        if(username === ""){
            setInvalidUsername("Enter a username.");
        }
        if(password === ""){
            setInvalidPassword("Enter a password.");
        }

        //Sends the user data to the server.
        if(username !== "" && password !== ""){
            let userInfo = {"username": username, "password": password};
    
            let xhttp = new XMLHttpRequest();
    
            xhttp.onreadystatechange = function(){
                if(this.readyState === 4 && this.status === 400){
                    setInvalidUsername("Username does not exist.");

                }else if(this.readyState === 4 && this.status === 404){
                    setInvalidPassword("Incorrect Password.");

                }else if(this.readyState === 4 && this.status === 201){
                    setIsOpen(false);
                    props.setUsername(username)
                }
            }

            xhttp.open("POST", "http://localhost:5000/login", false);
            xhttp.withCredentials = true;
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(userInfo));
        }
    }

    return (
        <DialogRoot placement="top" motionPreset="slide-in-bottom" open={isOpen} onInteractOutside={() => setIsOpen(false)}>
            <DialogTrigger asChild>
                <Button size="lg" colorPalette="teal" variant="solid" onClick={() => setIsOpen(true)}>Log in</Button>
            </DialogTrigger>

            <DialogContent style={{backgroundColor: '#41392e'}}>
                <DialogHeader>
                    <DialogTitle>Log in</DialogTitle>
                </DialogHeader>

                <DialogBody>
                    <Stack gap="4">
                        <Field invalid={invalidUsername === '' ? false : true}
                                label="Username"
                                errorText={invalidUsername}
                                required>
                            <Input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => {if(e.key === "Enter") loginFunction()}} placeholder="Username" />
                        </Field>
                        <Field invalid={invalidPassword ==='' ? false : true}
                                label="Password"
                                errorText={invalidPassword}
                                required>
                            <PasswordInput value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => {if(e.key === "Enter") loginFunction()}} placeholder="Password" />
                        </Field>
                    </Stack>
                </DialogBody>

                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant="ouline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    </DialogActionTrigger>
                    <Button background="teal" color="white" onClick={loginFunction}>Log in</Button>
                </DialogFooter>
            </DialogContent>

        </DialogRoot>
    )
}