import React, {useState} from 'react'
import { NavLink, Outlet, useNavigate, useLoaderData } from "react-router-dom"
import { useEffect } from 'react';
import axios from 'axios';

let currentSong = document.createElement('audio');

let lastPlayedTrack;
let interval;
let lastVolume = 0.8;
const cloud_name = "dw5heht2b";

function pauseSong(trackId){
	currentSong.pause();

	cancelAnimationFrame(interval);
	
    /*
    Basically if you're on a page playing a song called "Tropical Beach" and you navigate to a different page
    and play a different song, it will pause this song to play the other song, but since this song might not appear on that page,
    it will give document.getElementById a null value.
    */
    if(document.getElementById(trackId) !== null){
        document.getElementById(trackId).innerHTML = "play_circle";
    }
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

	xhttp.open("POST", "https://puzzled-worm-sweater.cyclic.app/like", false);
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({song: trackId}));
}

function comment(){

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

    xhttp.open("POST", "https://puzzled-worm-sweater.cyclic.app/logout", false);
    xhttp.withCredentials = true;
    xhttp.send();
}

function repeat(){
    if(currentSong.loop === true){
        document.getElementById("repeat").style.color = "";
        currentSong.loop = false;
    }else{
        document.getElementById("repeat").style.color = "lightblue";
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

function playSong(trackId, pictureId){
    if(trackId === undefined || pictureId === undefined){
        return;
    }

    if(trackId !== lastPlayedTrack){
        if(lastPlayedTrack!==undefined){
            pauseSong(lastPlayedTrack);
        }
        currentSong.src = `https://res.cloudinary.com/${cloud_name}/video/upload/${trackId}`;
        currentSong.load();
    }

    cancelAnimationFrame(interval);
    displaySongImage(pictureId);
    currentSong.play();

    document.getElementById(trackId).innerHTML = "pause_circle";
    document.getElementById("play_arrow").innerHTML = "pause";

    lastPlayedTrack = trackId;
}

//Displays the song image in the music player.
function displaySongImage(pictureId){
    if(lastPlayedTrack !== undefined){
        document.getElementById("imageSource").src = `https://res.cloudinary.com/${cloud_name}/image/upload/w_65,h_65,c_fill,q_100/${pictureId}`;
    }else{
        document.getElementById("songCoverBackground").outerHTML = `<div id="songCover"><img class="songImageCover" id="imageSource" src="https://res.cloudinary.com/${cloud_name}/image/upload/w_65,h_65,c_fill,q_100/${pictureId}"></div>`;
    }
}

export default function RootLayout(){
    const [songTitle, setSongTitle] = useState("Song Title");
    const [songArtist, setSongArtist] = useState("Artist");
    const [beginningTime, setBeginningTime] = useState("00:00");
    const [endTime, setEndTime] = useState("00:00");

    /*Output the total duration of the song*/
    currentSong.onloadedmetadata = function(){
        setEndTime(calculateTime(currentSong.duration));
        document.getElementById("songSlider").setAttribute('max', `${Math.floor(currentSong.duration * 1000)}`);
    };

    function switchFunction(trackId, pictureId, username, title){
        if(trackId !== lastPlayedTrack || currentSong.paused){
            if(trackId !== lastPlayedTrack){
                setSongTitle(title);
                setSongArtist(username);
            }
            playSong(trackId, pictureId);
            interval = requestAnimationFrame(updateTimeStamp);
        }else{
            pauseSong(trackId);
        }
    }

    function footerSwitchFunction(){
        if(currentSong.paused){
            cancelAnimationFrame(interval);
            currentSong.play();
            interval = requestAnimationFrame(updateTimeStamp);
            document.getElementById("play_arrow").innerHTML = "pause";
            
            if(document.getElementById(lastPlayedTrack) !== null){
                document.getElementById(lastPlayedTrack).innerHTML = "pause_circle";
            }
        }else{
            pauseSong(lastPlayedTrack);
        }
    }

    /*Updates the current timestamp of the song*/
    function updateTimeStamp(){
        interval = requestAnimationFrame(updateTimeStamp);
        if(!isNaN(currentSong.duration)){
            document.getElementById("songSlider").value = (currentSong.currentTime / currentSong.duration) * (currentSong.duration * 1000);
            setBeginningTime(calculateTime(currentSong.currentTime));
        }
    }

    useEffect(() => {
        let songSlider = document.getElementById("songSlider");

		songSlider.addEventListener('input', () =>{
			setBeginningTime(calculateTime(document.getElementById("songSlider").value/1000));
	
			if(!currentSong.paused){
				cancelAnimationFrame(interval);
			}
		});

		/*After the user changes the song range, it'll update the time.*/
		songSlider.addEventListener('change', () =>{
            if(currentSong.src !== ""){
                currentSong.currentTime = currentSong.duration * (document.getElementById("songSlider").value / (currentSong.duration * 1000));
            }

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
			pauseSong(lastPlayedTrack);
			cancelAnimationFrame(interval);
		});
    }, []);

    //For some reason putting this outside the function breaks the website.
    const navigate = useNavigate();
    const username = useLoaderData().username;

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
                    <input type="text" className="searchTextbox" id="search" name="search" placeholder='Search' onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            searchSong();
                        }
                    }}></input>
                    <button type="button" className="submitSong" onClick={() => searchSong()}>Search</button>
                    <NavLink to="home">Home</NavLink>
                    <NavLink to="upload">Upload</NavLink>
                    <NavLink to={"profile/" + username}>Profile</NavLink>
                    <NavLink to="/" onClick={() => logout()}>Logout</NavLink>
                </div>
                <h2>Zanith</h2>
            </header>

            <main>
                <Outlet context = {{switchFunction, like, lastPlayedTrack, username}}/>
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
                        <p className="musicPlayerTitle">{songTitle}</p>
                        <p className="musicPlayerArtist">{songArtist}</p>
                        <div className="timeStamp">
                            <p className="beginningTime">{beginningTime}</p>
                            <input id="songSlider" type="range" min="0" max="1000" defaultValue="0" />
                            <p className="endTime">{endTime}</p>
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

export const rootLoader = async () => {
	const res = await axios.get("https://puzzled-worm-sweater.cyclic.app/root", {withCredentials: true});

	return res.data;
}