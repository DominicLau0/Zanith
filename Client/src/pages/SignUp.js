import {useState} from 'react'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';

import { Input, Button, Stack} from '@chakra-ui/react'
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger} from "../components/ui/dialog"
import { Field } from "../components/ui/field"
import { PasswordInput, PasswordStrengthMeter } from "../components/ui/password-input"
import { passwordStrength } from 'check-password-strength'

export default function SignUp(props){
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");

    const [invalidUsername, setInvalidUsername] = useState("");
    const [invalidPassword, setInvalidPassword] = useState("");
    const [invalidEmail, setInvalidEmail] = useState("");
    const [invalidDisplayName, setInvalidDisplayName] = useState("");

    function signupFunction(){
        //Clear the system message.
        setInvalidUsername("");
        setInvalidPassword("");
        setInvalidEmail("");
        setInvalidDisplayName("");
    
        //Check if the username is empty and if the password is at least 10 characters long.
        if(username === ""){
            setInvalidUsername("Username cannot be empty.");            
        }
        if(password.length < 8){
            setInvalidPassword("Password must be at least 8 characters long.");
        }

        //Check to see if the email address and name is empty.
        if(email === ""){
            setInvalidEmail("Enter an email.");
        }
        if(displayName === ""){
            setInvalidDisplayName("Enter a name.");
        }
    
        //Sends the user data to the server.
        if(username !== "" && password.length >=10 && email !== "" && displayName !== ""){
            let personalInfo = {"username": username, "password": password, "email": email, "displayName": displayName};
    
            let xhttp = new XMLHttpRequest();
    
            xhttp.onreadystatechange = function(){
                if(this.readyState === 4 && this.status === 400){
                    setInvalidUsername("Username has been taken.");

                }else if(this.readyState === 4 && this.status === 201){
                    setIsOpen(false);
                    props.setUsername(username)
                }
            }
    
            xhttp.open("POST", "http://localhost:5000/signup", false);
            xhttp.withCredentials = true;
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(personalInfo));
        }
    }

    return (
        <DialogRoot placement="top" motionPreset="slide-in-bottom" open={isOpen} onInteractOutside={() => setIsOpen(false)}>
            <DialogTrigger asChild>
                <Button size="lg" colorPalette="teal" variant="outline" onClick={() => setIsOpen(true)}>Sign up</Button>
            </DialogTrigger>

            <DialogContent style={{backgroundColor: '#41392e'}}>
                <DialogHeader>
                    <DialogTitle>Sign up</DialogTitle>
                </DialogHeader>

                <DialogBody>
                    <Stack gap="4">
                        <Field invalid={invalidDisplayName === '' ? false : true}
                                label="Display Name"
                                helperText="This is the name users see by default."
                                errorText={invalidDisplayName}
                                required>
                            <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display Name" />
                        </Field>
                        <Field invalid={invalidEmail === '' ? false : true}
                                label="Email"
                                errorText={invalidEmail}
                                required>
                            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                        </Field>
                        <Field invalid={invalidUsername === '' ? false : true}
                                label="Username"
                                errorText={invalidUsername}
                                helperText="Username must be unique. Each user has a unique username."
                                required>
                            <Input value={username.toLowerCase()} onChange={e => setUsername(e.target.value.toLowerCase())} placeholder="Username" />
                        </Field>
                        <Field invalid={invalidPassword === '' ? false : true}
                                label="Password"
                                errorText={invalidPassword}
                                helperText="Password must be at least 8 characters long."
                                required>
                            <PasswordInput value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
                        </Field>
                        <PasswordStrengthMeter value={passwordStrength(password).id + 1} placeholder="Password" />
                    </Stack>
                </DialogBody>

                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant="ouline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    </DialogActionTrigger>
                    <Button background="teal" color="white" onClick={signupFunction}>Sign up</Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    )
}