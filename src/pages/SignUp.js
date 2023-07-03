import React from 'react'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';

export default function SignUp(){
    useEffect(() => {
		document.title = "Signup";
	}, []);

    const navigate = useNavigate();

    function signupFunction(submit){
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let email = document.getElementById("email").value;
    
        //Clear the system message.
        document.getElementById("usernameMessageSignup").innerHTML = "";
        document.getElementById("passwordMessageSignup").innerHTML = "";
        document.getElementById("emailMessageSignup").innerHTML = "";
    
        //Check to see if the email address is empty.
        if(email === ""){
            document.getElementById("emailMessageSignup").innerHTML = "<p>Enter an email.<p>";
        }
    
        //Check that the username and password is at least 10 characters long.
        if(username.length === 0){
            document.getElementById("usernameMessageSignup").innerHTML = "<p>The username cannot be empty.<p>";            
        }
        if(password.length < 10){
            document.getElementById("passwordMessageSignup").innerHTML = "<p>The password must be at least 10 characters long.<p>";
        }
    
        //Sends the user data to the server.
        if(submit === true && username !== "" && password.length >=10 && email !== ""){
            let personalInfo = {"username": username, "password": password, "email": email};
    
            let xhttp = new XMLHttpRequest();
    
            xhttp.onreadystatechange = function(){
                if(this.readyState === 4 && this.status === 400){
                    document.getElementById("usernameMessageSignup").innerHTML = "<p>Username has been taken.<p>";
                    
                }else if(this.readyState === 4 && this.status === 201){
                    navigate("/home");
                }
            }
    
            xhttp.open("POST", "http://localhost:5000/signup", false);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(personalInfo));
        }
    }

    return (
        <>
            <div className="signupLoginDiv">
                <h2 className="authenticationTitle">Sign Up</h2>
                <label className="authenticationLabel" htmlFor="username">Username</label>
                <br />
                <input className="textbox" type="text" id="username" name="username" onKeyUp={signupFunction} placeholder="Username" />
                <div id="usernameMessageSignup"></div>
                <label className="authenticationLabel" htmlFor="password">Password</label>
                <br />
                <input className="textbox" type="password" id="password" name="password" onKeyUp={signupFunction} placeholder="Password" />
                <div id="passwordMessageSignup"></div>
                <label className="authenticationLabel" htmlFor="email">Email</label>
                <br />
                <input className="textbox" type="text" id="email" name="email" onKeyUp={signupFunction} placeholder="Email" />
                <div id="emailMessageSignup"></div>
                <button className="submit authenticationMargin" type="button" onClick={() => signupFunction(true)}>Sign up</button>
            </div>
        </>
    )
}