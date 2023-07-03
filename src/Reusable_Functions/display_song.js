import React from 'react'
import { useEffect } from 'react';

let currentSong = document.createElement('audio');
currentSong.id = "audio";

let lastPlayedTrack;
let interval;
let pictureIdGlobal;
let usernameGlobal;
let titleGlobal;
let listen;

/*Output the total duration of the song*/
currentSong.onloadedmetadata = function(){
	document.getElementById("endTime").innerHTML = calculateTime(currentSong.duration);
	document.getElementById("songSlider").setAttribute('max', `${Math.floor(currentSong.duration * 1000)}`);
};

function pauseSong(trackId){
	currentSong.pause();

	cancelAnimationFrame(interval);
	
	document.getElementById(trackId).innerHTML = "play_circle";

	document.getElementById("play_arrow").innerHTML = "play_arrow";
}

function increaseListenCount(trackId){
	let listenAmount;

	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){
		if(this.readyState === 4 && this.status ===200){
			listenAmount = JSON.parse(this.responseText).listen;

			document.getElementById(`listenAmount:${trackId}`).textContent = listenAmount;
		}
	}

	xhttp.open("POST", "http://localhost:5000/listen", false);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.withCredentials = true;
	xhttp.send(JSON.stringify({song: trackId}));
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

export default function DisplaySong(props){
	useEffect(() => {
		let audioDiv = document.getElementById("audioDiv");
		audioDiv.append(currentSong);

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
	}, [])

	function playSong(trackId, pictureId, username, title){
		clearTimeout(listen);
	
		if(trackId === undefined || pictureId === undefined){
			return;
		}
	
		if(trackId !== lastPlayedTrack){
			if(lastPlayedTrack!==undefined){
				pauseSong(lastPlayedTrack, pictureIdGlobal, usernameGlobal, titleGlobal);
			}
			currentSong.src = `https://res.cloudinary.com/${props.cloud_name}/video/upload/${trackId}`;
			currentSong.load();
		}
	
		if(trackId !== lastPlayedTrack){
			listen = setTimeout(function() {
				increaseListenCount(trackId);
			}, 3000);
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

	//Displays the song image in the music player.
	function displaySongImage(pictureId){
		if(lastPlayedTrack !== undefined){
			document.getElementById("songCover").innerHTML = `<img class="songImageCover", src="https://res.cloudinary.com/${props.cloud_name}/image/upload/w_65,h_65,c_fill,q_100/${pictureId}">`;
		}else{
			document.getElementById("songCoverBackground").outerHTML = `<div id="songCover"><img class="songImageCover", src="https://res.cloudinary.com/${props.cloud_name}/image/upload/w_65,h_65,c_fill,q_100/${pictureId}"></div>`;
		}
	}

    return(
        <div className="songContainer">
            {props.songs.songs.map(song => (
                <div className="individualSongContainer" key={song.song}>
                    <div className="imageContainer">
                        <img className="songImage" src={`https://res.cloudinary.com/${props.cloud_name}/image/upload/w_70,h_70,c_fill,q_100/${song.picture}`} alt={`${song.title}`} />
                        <i className="material-symbols-outlined iconStyles playPauseIcon" style={{fontSize:"45px"}} id={`${song.song}`} onClick={() => switchFunction(`${song.song}`, `${song.picture}`, `${song.username}`, `${song.title}`)}>play_circle</i></div>
                    <div className="songTitleandListens">
                        <p className="songTitle">{song.title}</p>
                        <p className="songArtist">{song.username}</p>
                        <div className="icon">
                            <i className="material-symbols-outlined" style={{fontSize:"18px"}}>play_arrow</i>
                            <p style={{fontSize:"14px"}} id={`listenAmount:${song.song}`}>{song.listens}</p>
                        </div>
                    </div>
                    <div className="genreSection">
                        {
                            (() => {
                                if(song.genre === "Classical"){
                                    return(<p className="genreClassical">{song.genre}</p>)
                                }else if(song.genre === "Rock"){
                                    return(<p className="genreRock">{song.genre}</p>)
                                }else if(song.genre === "Electronic"){
                                    return(<p className="genreElectronic">{song.genre}</p>)
                                }else if(song.genre === "Hip Hop"){
                                    return(<p className="genreHipHop">{song.genre}</p>)
                                }else if(song.genre === "Rap"){
                                    return(<p className="genreRap">{song.genre}</p>)
                                }else{
                                    return(<p className="genreOther">{song.genre}</p>)
                                }
                            })()
                        }
                        <div className="songStats">
                            <div className="icon">
                                {
									(() => {
										if(props.songs.like.filter(e => e.song === song.song).length > 0){
											return (<i style={{fontSize:"15px", color: "lightcoral"}} className="material-symbols-outlined iconStyles" onClick={() => like(`${song.song}`)} id={`likeIcon:${song.song}`}>favorite</i>);
										}else{
											return(<i style={{fontSize:"15px"}} className="material-symbols-outlined iconStyles" onClick={() => like(`${song.song}`)} id={`likeIcon:${song.song}`}>favorite</i>);
										}
									})()
								}
                                <p style={{fontSize:"14px"}} id={`likeAmount:${song.song}`}>{song.likes}</p>
                            </div>
                            <div className="icon">
                                <i className="material-symbols-outlined iconStyles" style={{fontSize:"15px"}} onClick={() => comment}>comment</i>
                                <p style={{fontSize:"14px"}}>{song.comments}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}