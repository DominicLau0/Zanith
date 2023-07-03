import React from 'react'
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useEffect } from 'react';

export default function RootLayout(){
    let currentSong;
    useEffect(() => {
        currentSong = document.getElementById('audio');
    }, []);

    let lastVolume = 0.8;

    const navigate = useNavigate();

    function logout(){
        let xhttp = new XMLHttpRequest();
    
        xhttp.open("POST", "/logout", false);
        xhttp.send();
    }

    function calculateVolume(volume){
        if(volume === 0){
            document.getElementById("volumeIcon").textContent = "volume_off";
        }else if(volume < 0.50){
            document.getElementById("volumeIcon").textContent = "volume_down";
        }else{
            document.getElementById("volumeIcon").textContent = "volume_up";
        }
    }

    function repeat(){
        if(currentSong.loop === true){
            document.getElementById("repeat").textContent = "repeat";
            currentSong.loop = false;
        }else{
            document.getElementById("repeat").textContent = "repeat_on";
            currentSong.loop = true;
        }
    }

    function mute(){
        if(currentSong.volume !== 0){
            document.getElementById("volumeIcon").textContent = "volume_off";
            document.getElementById("volumeSlider").value = 0;
            lastVolume = currentSong.volume;
            currentSong.volume = 0;
        }else{
            currentSong.volume = lastVolume;
            calculateVolume(currentSong.volume);
            document.getElementById("volumeSlider").value = lastVolume * 100;
        }
    }

    function searchSong(){
        let search = document.getElementById("search").value;
    
        if(search !== ""){
            navigate(`/search/${search}`);
        }
    }

    return(
        <>
            <header>
                <div className="linksHome">
                    <input type="text" className="searchTextbox" id="search" name="search" placeholder='Search'></input>
                    <button type="button" className="submitSong" onClick={searchSong}>Search</button>
                    <NavLink to="home">Home</NavLink>
                    <NavLink to="upload">Upload</NavLink>
                    <NavLink to="profile">Profile</NavLink>
                    <NavLink to="/" onClick={logout}>Logout</NavLink>
                </div>
                <h2>Zanith</h2>
            </header>

            <main>
                <Outlet/>
            </main>

            <footer>
                <div id="audioDiv"></div>
                <div className="controls">
                    <i className="material-symbols-rounded iconStyles controlsIcon" style={{fontSize: "25px"}}>skip_previous</i>
                    <i className="material-symbols-rounded iconStyles controlsIcon" style={{fontSize: "35px"}} id="play_arrow">play_arrow</i>
                    <i className="material-symbols-rounded iconStyles" style={{fontSize: "25px", marginRight: "15px"}}>skip_next</i>
                    <i className="material-symbols-rounded iconStyles" style={{ fontSize:`20px` }} id="repeat" onClick={repeat}>repeat</i>
                </div>
                <div className="musicDetails">
                    <div id="songCoverBackground">
                        <i className="material-symbols-rounded iconStyles" style={{fontSize:"25px"}}>headphones</i>
                    </div>
                    <div className="titleAndArtist">
                        <p className="musicPlayerTitle" id="songTitle">Song Title</p>
                        <p className="musicPlayerArtist" id="songArtist">Artist</p>
                        <div className="timeStamp">
                            <p id="beginningTime">00:00</p>
                            <input id="songSlider" type="range" min="0" max="1000" defaultValue="0" />
                            <p id="endTime">00:00</p>
                        </div>
                    </div>
                </div>
                <div className="volumeControls">
                    <i className="material-symbols-rounded iconStyles" style={{fontSize: "25px"}} id="volumeIcon" onClick={mute}>volume_up</i>
                <input id="volumeSlider" type="range" min="0" max="100" defaultValue="80" /></div>
            </footer>
        </>
    )
}