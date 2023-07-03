import React from 'react'
import { NavLink } from "react-router-dom"
import { useEffect } from 'react';

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