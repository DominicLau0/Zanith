import { useState } from 'react'
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

export default function Login(){
    console.log("test")
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [invalidUsername, setInvalidUsername] = useState("");
    const [invalidPassword, setInvalidPassword] = useState("");

    async function loginFunction(e){
        e.preventDefault()

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
            let xhttp = new XMLHttpRequest();
    
            xhttp.onreadystatechange = function(){
                if(this.readyState === 4 && this.status === 400){
                    setInvalidUsername("Username does not exist.");

                }else if(this.readyState === 4 && this.status === 404){
                    setInvalidPassword("Incorrect Password.");

                }else if(this.readyState === 4 && this.status === 201){
                    setIsOpen(false);
                    setUsername(username)
                }
            }

            xhttp.open("POST", "http://localhost:5000/login", false);
            xhttp.withCredentials = true;
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify({"username": username, "password": password}));

            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                body: JSON.stringify({"username": username, "password": password})
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Login</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={loginFunction}>
                    <DialogHeader>
                        <DialogTitle>Login</DialogTitle>
                        <DialogDescription>
                            Login to an existing account now.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Username</Label>
                            <Input id="name-1" name="username" onChange={e => setUsername(e.target.value)}/>
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
                            <Input id="password" type="password" onChange={e => setPassword(e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Login</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}