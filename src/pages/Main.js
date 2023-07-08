import React from 'react'
import { NavLink, redirect } from "react-router-dom"
import { useEffect } from 'react';
import axios from 'axios';

export default function Main(){
    useEffect(() => {
		document.title = "Zanith";
	}, []);

    return (
        <>
            <header>
                <div className="indexLinks">
                    <NavLink to="signup" className="signupLoginButton">Sign up</NavLink>
                    <NavLink to="login" className="signupLoginButton">Log in</NavLink>
                </div>
                <h2>Zanith</h2>
            </header>
            <div className="mainText">
                <h1>Stream and Listen with Zanith</h1>
                <h3>Upload | Listen | Distribute</h3>
            </div>
        </>
    )
}

export const mainLoader = async () => {
    try{
<<<<<<< HEAD
        const res = await axios.get("https://puzzled-worm-sweater.cyclic.app/root", {withCredentials: true});
=======
        const res = await axios.get("http://localhost:5000/root", {withCredentials: true});
>>>>>>> 68eb1b32275fb829a9e08db0173281eed6313307

        if(res.status === 200){
            return redirect("home");
        }
    } catch (error) {
        return null;
    }
}