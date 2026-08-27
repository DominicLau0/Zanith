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
            try{
                const res = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"username": username, "password": password})
                });
            
                if(res.status === 400){
                    setInvalidUsername("Username does not exist.");

                }else if(res.status === 404){
                    setInvalidPassword("Incorrect Password.");

                }else if(res.status === 201){
                    setIsOpen(false);
                    setUsername(username)
                }else {
                    const text = await res.text();
                    console.warn("Unexpected response:", res.status, text);
                }
            } catch (err) {
                setInvalidPassword("Network error. Please try again.")
            }
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
                        <div className="grid gap-3 mt-4">
                            <Label htmlFor="name-1">Username</Label>
                            <Input id="name-1" name="username" onChange={e => setUsername(e.target.value)} required/>
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
                    <DialogFooter className="mt-4">
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