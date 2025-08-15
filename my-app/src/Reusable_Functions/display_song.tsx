// @ts-nocheck

import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MdInsertComment, MdFavorite, MdFavoriteBorder, MdOutlinePlayCircle, MdOutlinePauseCircle } from "react-icons/md";
import { Badge } from "@/components/ui/badge"

const cloud_name = "dw5heht2b";
let lastPlayedTrack;

const genreClassMap = {
  Classical: "genreClassical",
  Rock:      "genreRock",
  Electronic:"genreElectronic",
  "Hip Hop": "genreHipHop",
  Rap:       "genreRap",
};

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

    xhttp.open("POST", "http://localhost:5000/listen", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.withCredentials = true;
    xhttp.send(JSON.stringify({song: trackId}));
}

export default function DisplaySong(props){
    const navigate = useNavigate();

    return(
        <div className="songContainer">
            {props.songs.songs.map(song => (
                <div className="individualSongContainer" key={song.song}>
                    <div className="imageContainer">
                        <img className="songImage" src={`https://res.cloudinary.com/${cloud_name}/image/upload/w_70,h_70,c_fill,q_100/${song.picture}`} alt={`${song.title}`} />
                        {props.lastPlayedTrack === song.song ? (
                            <MdOutlinePauseCircle
                                id={`${song.song}`}
                                onClick={() => increaseListenCount(song.song, song.picture, song.username, song.title, props)}
                            />
                        ) : (
                            <MdOutlinePlayCircle
                                id={`${song.song}`}
                                onClick={() => increaseListenCount(song.song, song.picture, song.username, song.title, props)}
                            />
                        )}
                    </div>
                    <div className="songTitleandListens">
                        <div>
                            <p onClick={() => navigate("/song/" + song.song)} className="songTitle">{song.title}</p>
                            <p onClick={() => navigate("/profile/" + song.username)} className="songArtist">{song.username}</p>
                        </div>
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
                                    return(<Badge variant="secondary">{song.genre}</Badge>)
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
                                {song.likes.includes(props.username) ? (
                                    <MdFavorite
                                        className="lightcoral"
                                        onClick={() => props.like(`${song.song}`)}
                                        id={`likeIcon:${song.song}`}
                                    />
                                ):(
                                    <MdFavoriteBorder
                                        onClick={() => props.like(`${song.song}`)}
                                        id={`likeIcon:${song.song}`}
                                    />
                                )}
                                <p style={{fontSize:"14px"}} id={`likeAmount:${song.song}`}>{song.likes.length}</p>
                            </div>
                            <div className="icon">
                                <MdInsertComment onClick={() => navigate("/song/" + song.song +"/#commentHeader")}/>
                                <p style={{fontSize:"14px"}}>{song.comments.length}</p>
                                <Badge variant="secondary">test</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}