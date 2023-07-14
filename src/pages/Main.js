import React from 'react'
import { NavLink, redirect } from "react-router-dom"
import { useEffect } from 'react';
import axios from 'axios';

export default function Main(){
    useEffect(() => {
		document.title = "Zanith";

        document.body.classList.add("bodyColour");
		return () => {
			document.body.classList.remove("bodyColour");
		}
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
            <div>
                <p className="mainText">Start your music career <br/> with <span className='gradientText'>Zanith</span></p>
                <p className="subText">Meet a diverse set of upcoming artists <br/> and a platform to share your music to the world.</p>
            </div>
            <div className="">

            </div>
        </>
    )
}

export const mainLoader = async () => {
    try{
        const res = await axios.get("https://puzzled-worm-sweater.cyclic.app/root", {withCredentials: true});

        if(res.status === 200){
            return redirect("home");
        }
    } catch (error) {
        return null;
    }
}