import React from 'react'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';

export default function Login(){
    useEffect(() => {
		document.title = "Login";
	}, []);

    const navigate = useNavigate();

    function loginFunction(submit){
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
    
        //Clear the system message.
        document.getElementById("usernameMessageLogin").innerHTML = "";
        document.getElementById("passwordMessageLogin").innerHTML = "";
    
        //Check to see if the username and password is empty.
        if(username === ""){
            document.getElementById("usernameMessageLogin").innerHTML = "<p>Enter a username.<p>";
        }
        if(password === ""){
            document.getElementById("passwordMessageLogin").innerHTML = "<p>Enter a password.<p>";
        }
        //Sends the user data to the server.
        if(submit === true && username !== "" && password !== ""){
            let userInfo = {"username": username, "password": password};
    
            let xhttp = new XMLHttpRequest();
    
            xhttp.onreadystatechange = function(){
                if(this.readyState === 4 && this.status === 400){
                    document.getElementById("usernameMessageLogin").innerHTML = "<p>Username does not exist.<p>";
    
                }else if(this.readyState === 4 && this.status === 404){
                    document.getElementById("passwordMessageLogin").innerHTML = "<p>Incorrect Password.<p>";
    
                }else if(this.readyState === 4 && this.status === 201){
                    navigate("/home");
                }
            }
    
            xhttp.open("POST", "http://localhost:5000/login", false);
            xhttp.withCredentials = true;
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(userInfo));
        }
    }

    return (
        <>
            <div className="signupLoginDiv">
                <h2 className="authenticationTitle">Login</h2>
                <label className="authenticationLabel" htmlFor="username">Username</label>
                <br />
                <input className="textbox" type="text" id="username" name="username" onKeyUp={loginFunction} placeholder="Username" />
                <div id="usernameMessageLogin"></div>
                <label className="authenticationLabel" htmlFor="password">Password</label>
                <br />
                <input className="textbox" type="password" id="password" name="password" onKeyUp={loginFunction} placeholder="Password" />
                <div id="passwordMessageLogin"></div>
                <button className="submit authenticationMargin" type="button" onClick={() => loginFunction(true)}>Login</button>
            </div>
        </>
    )
}