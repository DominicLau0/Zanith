import React from 'react'

const cloud_name = "dw5heht2b";
let lastPlayedTrack;

function increaseListenCount(trackId, pictureId, username, title, props){
    if(trackId === lastPlayedTrack){
        props.switchFunction(trackId, pictureId, username, title);
        return;
    }else{
        props.switchFunction(trackId, pictureId, username, title);
        lastPlayedTrack = trackId;
    }

	let listenAmount;

	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){
		if(this.readyState === 4 && this.status ===200){
			listenAmount = JSON.parse(this.responseText).listen;

			document.getElementById(`listenAmount:${trackId}`).textContent = listenAmount;
		}
	}

<<<<<<< HEAD
	xhttp.open("POST", "https://puzzled-worm-sweater.cyclic.app/listen", false);
=======
	xhttp.open("POST", "http://localhost:5000/listen", false);
>>>>>>> 68eb1b32275fb829a9e08db0173281eed6313307
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.withCredentials = true;
	xhttp.send(JSON.stringify({song: trackId}));
}

export default function DisplaySong(props){
    return(
        <div className="songContainer">
            {props.songs.songs.map(song => (
                <div className="individualSongContainer" key={song.song}>
                    <div className="imageContainer">
                        <img className="songImage" src={`https://res.cloudinary.com/${cloud_name}/image/upload/w_70,h_70,c_fill,q_100/${song.picture}`} alt={`${song.title}`} />
                        {
                            (() => {
                                if(props.lastPlayedTrack === song.song){
                                    return(
                                        <i className="material-symbols-outlined iconStyles playPauseIcon" style={{fontSize:"45px"}} id={`${song.song}`} onClick={() => increaseListenCount(song.song, song.picture, song.username, song.title, props)}>pause_circle</i>
                                    )
                                }else{
                                    return(
                                        <i className="material-symbols-outlined iconStyles playPauseIcon" style={{fontSize:"45px"}} id={`${song.song}`} onClick={() => increaseListenCount(song.song, song.picture, song.username, song.title, props)}>play_circle</i>
                                    )
                                }
                            })()
                        }
                    </div>
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
											return (<i style={{fontSize:"15px", color: "lightcoral"}} className="material-symbols-outlined iconStyles" onClick={() => props.like(`${song.song}`)} id={`likeIcon:${song.song}`}>favorite</i>);
										}else{
											return(<i style={{fontSize:"15px"}} className="material-symbols-outlined iconStyles" onClick={() => props.like(`${song.song}`)} id={`likeIcon:${song.song}`}>favorite</i>);
										}
									})()
								}
                                <p style={{fontSize:"14px"}} id={`likeAmount:${song.song}`}>{song.likes}</p>
                            </div>
                            <div className="icon">
                                <i className="material-symbols-outlined iconStyles" style={{fontSize:"15px"}}>comment</i>
                                <p style={{fontSize:"14px"}}>{song.comments}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}