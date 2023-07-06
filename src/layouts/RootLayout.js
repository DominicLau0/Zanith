import React from 'react'
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useEffect } from 'react';

let currentSong = document.createElement('audio');

let lastPlayedTrack;
let interval;
let pictureIdGlobal;
let usernameGlobal;
let titleGlobal;
let listen;
let lastVolume = 0.8;
const cloud_name = "dw5heht2b";

function pauseSong(trackId){
	currentSong.pause();

	cancelAnimationFrame(interval);
	
    document.getElementById(trackId).innerHTML = "play_circle";
    document.getElementById("play_arrow").innerHTML = "play_arrow";        
}

function like(trackId){
	let likeAmount;
	let newLike;

	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){
		if(this.readyState === 4 && this.status === 200){
			likeAmount = JSON.parse(this.responseText).like;
			newLike = JSON.parse(this.responseText).newLike;

            document.getElementById(`likeAmount:${trackId}`).textContent = likeAmount;        

            if(newLike === true){
                document.getElementById(`likeIcon:${trackId}`).style.color = "lightcoral";
            }else{
                document.getElementById(`likeIcon:${trackId}`).style.color = "";
            }
		}
	}

	xhttp.open("POST", "http://localhost:5000/like", false);
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({song: trackId}));
}

function comment(){

}

/*Updates the current timestamp of the song*/
function updateTimeStamp(){
	interval = requestAnimationFrame(updateTimeStamp);
	if(!isNaN(currentSong.duration)){
		document.getElementById("songSlider").value = (currentSong.currentTime / currentSong.duration) * (currentSong.duration * 1000);
		document.getElementById("beginningTime").textContent = calculateTime(currentSong.currentTime);
	}
}

/*Converts the input to a time based on minutes:seconds*/
function calculateTime(time){
	let minutes = Math.floor(time / 60);
	let seconds = Math.floor(time % 60);

	if(seconds < 10){
		seconds = "0" + seconds;
	}
	return minutes+":"+seconds;
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

function logout(){
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/logout", false);
    xhttp.send();
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

function playSong(trackId, pictureId, username, title){
    clearTimeout(listen);

    if(trackId === undefined || pictureId === undefined){
        return;
    }

    if(trackId !== lastPlayedTrack){
        if(lastPlayedTrack!==undefined){
            pauseSong(lastPlayedTrack, pictureIdGlobal, usernameGlobal, titleGlobal);
        }
        currentSong.src = `https://res.cloudinary.com/${cloud_name}/video/upload/${trackId}`;
        currentSong.load();
    }

    displaySongImage(pictureId);
    currentSong.play();
    interval = requestAnimationFrame(updateTimeStamp);

    document.getElementById(trackId).innerHTML = "pause_circle";
    document.getElementById("play_arrow").innerHTML = "pause";
    document.getElementById("songTitle").innerHTML = title;        
    document.getElementById("songArtist").innerHTML = username;

    lastPlayedTrack = trackId;
    pictureIdGlobal = pictureId;
    usernameGlobal = username;
    titleGlobal = title;
}

function switchFunction(trackId, pictureId, username, title){
    if(trackId !== lastPlayedTrack || currentSong.paused){
        playSong(trackId, pictureId, username, title);
    }else{
        pauseSong(trackId, pictureId, username, title);
    }
}

function footerSwitchFunction(){
    if(currentSong.paused){
        currentSong.play();
        document.getElementById("play_arrow").innerHTML = "pause";
        document.getElementById(lastPlayedTrack).innerHTML = "pause_circle";
    }else{
        currentSong.pause();
        document.getElementById("play_arrow").innerHTML = "play_arrow";
        document.getElementById(lastPlayedTrack).innerHTML = "play_circle";
    }
}

//Displays the song image in the music player.
function displaySongImage(pictureId){
    if(lastPlayedTrack !== undefined){
        document.getElementById("songCover").innerHTML = `<img class="songImageCover", src="https://res.cloudinary.com/${cloud_name}/image/upload/w_65,h_65,c_fill,q_100/${pictureId}">`;
    }else{
        document.getElementById("songCoverBackground").outerHTML = `<div id="songCover"><img class="songImageCover", src="https://res.cloudinary.com/${cloud_name}/image/upload/w_65,h_65,c_fill,q_100/${pictureId}"></div>`;
    }
}

export default function RootLayout(){
    useEffect(() => {
        /*Output the total duration of the song*/
        currentSong.onloadedmetadata = function(){
            document.getElementById("endTime").innerHTML = calculateTime(currentSong.duration);
            document.getElementById("songSlider").setAttribute('max', `${Math.floor(currentSong.duration * 1000)}`);
        };

        let songSlider = document.getElementById("songSlider");

		songSlider.addEventListener('input', () =>{
			document.getElementById("beginningTime").textContent = calculateTime(document.getElementById("songSlider").value/1000);
	
			if(!currentSong.paused){
				cancelAnimationFrame(interval);
			}
		});

		/*After the user changes the song range, it'll update the time.*/
		songSlider.addEventListener('change', () =>{
			currentSong.currentTime = currentSong.duration * (document.getElementById("songSlider").value / (currentSong.duration * 1000));

			if(!currentSong.paused){
				requestAnimationFrame(updateTimeStamp);
			}
		});

		let volumeSlider = document.getElementById("volumeSlider");

        /*Changes the volume of the song as well as the icon*/
        volumeSlider.addEventListener('input', () =>{
            currentSong.volume = document.getElementById("volumeSlider").value / 100;
        
            calculateVolume(currentSong.volume);
        });

		currentSong.addEventListener('ended', function() {
			pauseSong(lastPlayedTrack, pictureIdGlobal, usernameGlobal, titleGlobal);
			cancelAnimationFrame(interval);
		});
    }, []);

    //For some reason putting this outside the function breaks the website.
    const navigate = useNavigate();

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
                    <button type="button" className="submitSong" onClick={() => searchSong()}>Search</button>
                    <NavLink to="home">Home</NavLink>
                    <NavLink to="upload">Upload</NavLink>
                    <NavLink to="profile">Profile</NavLink>
                    <NavLink to="/" onClick={() => logout()}>Logout</NavLink>
                </div>
                <h2>Zanith</h2>
            </header>

            <main>
                <Outlet context = {{switchFunction, like}}/>
            </main>

            <footer>
                <div id="audioDiv"></div>
                <div className="controls">
                    <i className="material-symbols-rounded iconStyles controlsIcon" style={{fontSize: "25px"}}>skip_previous</i>
                    <i className="material-symbols-rounded iconStyles controlsIcon" style={{fontSize: "35px"}} id="play_arrow" onClick={() => footerSwitchFunction()}>play_arrow</i>
                    <i className="material-symbols-rounded iconStyles" style={{fontSize: "25px", marginRight: "15px"}}>skip_next</i>
                    <i className="material-symbols-rounded iconStyles" style={{ fontSize:`20px` }} id="repeat" onClick={() => repeat()}>repeat</i>
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
                    <i className="material-symbols-rounded iconStyles" style={{fontSize: "25px"}} id="volumeIcon" onClick={() => mute()}>volume_up</i>
                <input id="volumeSlider" type="range" min="0" max="100" defaultValue="80" /></div>
            </footer>
        </>
    )
}