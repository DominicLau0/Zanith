// @ts-nocheck

import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MdInsertComment, MdFavorite, MdFavoriteBorder, MdOutlinePlayCircle, MdOutlinePauseCircle, MdOutlinePlayArrow } from "react-icons/md";
import { Badge } from "@/components/ui/badge"
import { FaPlay } from "react-icons/fa";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";

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

    xhttp.open("POST", "http://localhost:5000/listen", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.withCredentials = true;
    xhttp.send(JSON.stringify({song: trackId}));
}

export default function DisplaySong(props){
    const navigate = useNavigate();

    return(
        <div className="grid">
            {props.songs.songs.map(song => (
                <div className="flex rounded-md bg-zinc-300 dark:bg-zinc-600 my-2 mr-8 p-4" key={song.song}>
                    <img className="rounded-md" src={`https://res.cloudinary.com/${cloud_name}/image/upload/w_70,h_70,c_fill,q_100/${song.picture}`} alt={`${song.title}`} />
                    <div className="ml-1">
                        {props.lastPlayedTrack === song.song ? (
                        <FaCirclePause
                            className="size-8 object-scale-down"
                            id={`${song.song}`}
                            onClick={() => increaseListenCount(song.song, song.picture, song.username, song.title, props)}
                        />
                        ) : (
                        <FaCirclePlay
                            className="size-8 object-scale-down"
                            id={`${song.song}`}
                            onClick={() => increaseListenCount(song.song, song.picture, song.username, song.title, props)}
                        />
                        )}
                    </div>
                    <div className="">
                        <div className="mx-2">
                            <p className="font-semibold tracking-tight cursor-pointer m-0 leading-none" onClick={() => navigate("/song/" + song.song)}>{song.title}</p>
                            <p className="text-sm text-gray-300 tracking-tight cursor-pointer m-0 leading-none" onClick={() => navigate("/profile/" + song.username)}>{song.username}</p>
                        </div>
                        <div className="flex mx-2 items-center">
                            <FaPlay className="size-3 object-scale-down"/>
                            <p className="text-sm ml-1" id={`listenAmount:${song.song}`}>{song.listens}</p>
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
                                }else if(song.genre === "Hip Hop"){
                                    return(<p className="genreHipHop">{song.genre}</p>)
                                }else if(song.genre === "Rap"){
                                    return(<p className="genreRap">{song.genre}</p>)
                                }else{
                                    return(<Badge variant="secondary">{song.genre}</Badge>)
                                }
                            })()
                        }
                        <div className="flex">
                            <div className="flex items-center">
                                {song.likes.includes(props.username) ? (
                                    <MdFavorite
                                        className="fill-red-400 cursor-pointer"
                                        onClick={() => props.like(`${song.song}`)}
                                        id={`likeIcon:${song.song}`}
                                    />
                                ):(
                                    <MdFavoriteBorder
                                        className="cursor-pointer"
                                        onClick={() => props.like(`${song.song}`)}
                                        id={`likeIcon:${song.song}`}
                                    />
                                )}
                                <p id={`likeAmount:${song.song}`}>{song.likes.length}</p>
                            </div>
                            <div className="flex items-center ml-1">
                                <MdInsertComment className="cursor-pointer" onClick={() => navigate("/song/" + song.song +"/#commentHeader")}/>
                                <p>{song.comments.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}