// @ts-nocheck

import React from 'react'
import { NavLink, Outlet, useNavigate, useLoaderData } from "react-router-dom"
import { useEffect, useState, useRef, useCallback } from 'react';
import Cookies from 'universal-cookie'
import axios from 'axios';

import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

import { MdSkipPrevious, MdSkipNext, MdOutlineRepeat, MdVolumeUp, MdVolumeOff, MdVolumeDown, MdOutlinePlayCircleFilled, MdHeadphones  } from "react-icons/md";

import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"

import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const cookies = new Cookies();

let lastPlayedTrack;
let interval;
let lastVolume = 0.8;
const cloud_name = "dw5heht2b";

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

    /*
    const res = await axios.post(`http://localhost:5000/like`,{
        song: trackId
    }, {withCredentials: true});
    */
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
        return <MdVolumeOff/>
    }else if(volume < 0.50){
        return <MdVolumeDown/>
    }else{
        return <MdVolumeUp/>
    }
}

export default function RootLayout(){
    const [songTitle, setSongTitle] = useState("Song Title");
    const [songArtist, setSongArtist] = useState("Artist");
    const [songPicture, setSongPicture] = useState(null);

    
    const [songSlider, setSongSlider] = useState(0);
    const [songSliderMax, setSongSliderMax] = useState(0);

    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [volume, setVolume] = useState(80);
    const lastVolume = useRef(80);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [lastPlayedTrack, setLastPlayedTrack] = useState(null);
    
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const loaderData = useLoaderData()
    const [username, setUsername] = useState(() => loaderData ?? null);

    useEffect(() => {
        const audio = new Audio();
        audioRef.current = audio;

        const savedSong = cookies.get("song");
        const savedPicture = cookies.get("pictures");
        const savedTitle = cookies.get("title");
        const savedArtist = cookies.get("artist");

        if(savedSong){
            setLastPlayedTrack(savedSong);
            setSongTitle(savedTitle ?? "Song Title");
            setSongArtist(savedArtist ?? "Artist");
            setSongPicture(savedPicture ?? null);

            audio.src = `https://res.cloudinary.com/${cloud_name}/video/upload/${savedSong}`;
            audio.load();
        }

        const handleTimeUpdate = () => {
            setSongSlider(audio.currentTime || 0);
        };

        const handleLoadedMetadata = () => {
            setSongSliderMax(Number.isFinite(audio.duration) ? audio.duration : 0);
        };

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handleEnded = () => {
            setIsPlaying(false);

            if(audio.loop){
                return;
            }

            setSongSlider(0);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.pause();
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
            audio.src = "";

            if(audioRef.current === audio){
                audioRef.current = null;
            }
        };
    }, []);

    function setPlayerTrackCookie(trackId, pictureId, title, artist){
        const cookieOptions = {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 30
        };

        cookies.set("song", trackId, cookieOptions);
        cookies.set("pictures", pictureId, cookieOptions);
        cookies.set("title", title, cookieOptions);
        cookies.set("artist", artist, cookieOptions);
    }

    async function playSong(trackId, pictureId){
        const audio = audioRef.current;

        if(!audio || trackId === undefined || pictureId === undefined){
            return;
        }

        // Only replace the source when the user picked a different song.
        if(trackId !== lastPlayedTrack){
            audio.pause();
            audio.src = `https://res.cloudinary.com/${cloud_name}/video/upload/${trackId}`;
            audio.load();
            setSongSlider(0);
            setSongSliderMax(0);
            setSongPicture(pictureId);
        }

        setLastPlayedTrack(trackId);
        setSongPicture(pictureId);

        cookies.set("song", trackId, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30});
        cookies.set("pictures", pictureId, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30});

        try{
            await audio.play();
        }catch(error){
            console.warn("Audio could not start automatically:", error);
        }
    }

    function pauseSong(trackId){
        const audio = audioRef.current;

        if(!audio){
            return;
        }

        audio.pause();

        if(trackId){
            const songButton = document.getElementById(trackId);
            if(songButton){
                songButton.innerHTML = "play_circle";
            }
        }
    }

    function repeat(){
        const audio = audioRef.current;
        if(!audio){
            return;
        }

        const newRepeatValue = !audio.loop;
        audio.loop = newRepeatValue;
        setIsRepeat(newRepeatValue);
    }

    function handleVolumeChange(value){
        const newVolume = Number(value[0] ?? 0);

        setVolume(newVolume);

        if(newVolume > 0){
            lastVolume.current = newVolume;
        }

        if(audioRef.current){
            audioRef.current.volume = newVolume / 100;
        }
    }

    function mute(){
        const audio = audioRef.current;
        if(!audio){
            return;
        }

        if(volume > 0){
            lastVolume.current = volume;
            setVolume(0);
            audio.volume = 0;

        }else{
            const restoredVolume = lastVolume.current > 0 ? lastVolume.current : 80;

            setVolume(restoredVolume);
            audio.volume = restoredVolume / 100;
        }
    }

    function logout(){
        pauseSong(lastPlayedTrack);

        if(audioRef.current){
            audioRef.current.src = "";
            audioRef.current.load();
        }

        setLastPlayedTrack(null);
        setSongPicture(null);
        setSongTitle("Song Title");
        setSongArtist("Artist");
        setSongSlider(0);
        setSongSliderMax(0);

        let xhttp = new XMLHttpRequest();

        xhttp.open("POST", "http://localhost:5000/logout", false);
        xhttp.withCredentials = true;
        xhttp.send();

        setUsername(null);
    }

    function switchFunction(trackId, pictureId, username, title){
        const audio = audioRef.current;

        if(!audio){
            return;
        }

        if(trackId !== lastPlayedTrack){
            setSongTitle(title);
            setSongArtist(username);
            setPlayerTrackCookie(trackId, pictureId, title, username);
            playSong(trackId, pictureId);
        }else if(audio.paused){
            playSong(trackId, pictureId);
        }else{
            pauseSong(trackId);
        }
    }

    function footerSwitchFunction(){
        const audio = audioRef.current;

        if(!audio || !audio.src){
            return;
        }

        if(audio.paused){
            audio.play().catch(error => {
                console.warn("Audio could not start:", error);
            });
        }else{
            pauseSong(lastPlayedTrack);
        }
    }

    /*After the user changes the song range, it'll update the time.*/
    function handleSongSliderChange(value){
        const newValue = Number(value[0] ?? 0);
        const audio = audioRef.current;

        if(!audio || !Number.isFinite(audio.duration)){
            return;
        }

        setSongSlider(newValue);
        audio.currentTime = newValue;
    }

    function searchSong(){
        if(search.trim() !== ""){
            navigate(`/search/${search}`);
        }
    }

    return(
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar username={username}/>
                <SidebarTrigger />
                
                <div className="w-full pb-24">
                    <header className="flex gap-4 my-4 mr-8">
                        <h2 className="text-3xl flex-1 font-semibold tracking-tight">Home</h2>
                        <Input
                            type="search"
                            className="w-1/3"
                            placeholder="Search tracks, artists..."
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={(e) => {if(e.key === "Enter") searchSong()}}
                        />
                        <SignUp/>
                        <Login/>
                    </header>

                    <Outlet context = {{
                        switchFunction,
                        like,
                        lastPlayedTrack,
                        username
                    }}/>

                    <footer className="fixed bottom-0 left-64 right-0 z-50">
                        <div className="flex items-center justify-center w-full bg-stone-300 px-4">

                            <div className="flex flex-none">
                                <button className="size-10">
                                    <MdSkipPrevious className="size-10"/>
                                </button>

                                <button
                                    className="size-10"
                                    onClick={footerSwitchFunction}
                                    disabled={!lastPlayedTrack}
                                >
                                    <MdOutlinePlayCircleFilled className="size-10"/>
                                </button>

                                <button className="size-10">
                                    <MdSkipNext className="size-10"/>
                                </button>

                                <button onClick={repeat} className="size-10">
                                    <MdOutlineRepeat style={{color: isRepeat ? "lightblue" : ""}}/>
                                </button>
                            </div>
                            
                            <div className="flex items-center flex-1 max-w-2xl mx-8 min-w-0">
                                {songPicture === null ? (
                                    <MdHeadphones className="size-12 flex-none"/>
                                ) : (
                                    <img
                                        className="size-15 flex-none object-cover"
                                        src={`https://res.cloudinary.com/${cloud_name}/image/upload/w_1000,h_1000,c_fill,q_100/${cookies.get("pictures")}`}
                                        alt="Song cover"
                                    />
                                )}

                                <div className="flex-1 min-w-0 ml-3">
                                    <p className="text-sm font-semibold truncate">{songTitle}</p>
                                    <p className="text-xs truncate">{songArtist}</p>

                                    <div className="flex items-center gap-2">
                                        <p className="text-xs">{calculateTime(songSlider)}</p>

                                        <Slider
                                            className="flex-1"
                                            value={[songSlider]}
                                            min={0}
                                            max={songSliderMax}
                                            step={0.1}
                                            onValueChange={handleSongSliderChange}
                                            disabled={!lastPlayedTrack || songSliderMax <= 0}
                                        />

                                        <p className="text-xs">{calculateTime(songSliderMax)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-none items-center gap-2">
                                <button onClick={mute} aria-label={volume === 0 ? "Unmute" : "Mute"}>
                                    {calculateVolume(volume / 100)}
                                </button>

                                <Slider
                                    className="w-24"
                                    value={[volume]}
                                    onValueChange={handleVolumeChange}
                                    min={0}
                                    max={100}
                                    step={1}
                                />
                            </div>
                        </div>
                    </footer>
                </div>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export const rootLoader = async () => {
    try{
        const res = await axios.get("http://localhost:5000/root", {withCredentials: true});

        if(res.status === 200){
            return res.data.username;
        }
    } catch (error) {
        return null;
    }
}