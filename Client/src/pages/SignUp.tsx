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

    async function signupFunction(e){
        e.preventDefault()

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
            try{
                const res = await fetch("http://localhost:5000/signup", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"username": username, "password": password, "email": email, "displayName": displayName})
                });

                if(res.status === 400){
                    setInvalidUsername("Username has been taken.");

                }else if(res.status === 201){
                    setIsOpen(false);
                    props.setUsername(username)
                }
            } catch (err) {
                setInvalidPassword("Network error. Please try again.")
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">Sign up</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={signupFunction}>
                    <DialogHeader>
                        <DialogTitle>Sign up</DialogTitle>
                        <DialogDescription>
                            Create a new account now.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3 mt-4">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="name" onChange={e => setDisplayName(e.target.value)} required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" onChange={e => setUsername(e.target.value)} required/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" onChange={e => setPassword(e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Sign up</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}