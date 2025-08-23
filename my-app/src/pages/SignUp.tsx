import {useState} from 'react'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">Sign up</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign up</DialogTitle>
                    <DialogDescription>
                        Create a new account now.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="name-1" name="name" />
                    </div>
                    <div className="grid gap-3">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <a
                                href="#"
                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Signup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}