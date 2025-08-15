// @ts-nocheck

import React from 'react'
import { NavLink, Outlet, useNavigate, useLoaderData } from "react-router-dom"
import { useEffect, useState, useRef, useCallback } from 'react';
import Cookies from 'universal-cookie'
import axios from 'axios';

import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

import { Box, Grid, GridItem, Text, Spacer, Heading, Stack, HStack, VStack, Center, Button, Kbd, Flex} from '@chakra-ui/react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot} from "../components/ui/breadcrumb"
import { InputGroup } from "../components/ui/input-group"
import { Field } from "../components/ui/field"
import { Avatar, AvatarGroup } from "../components/ui/avatar"
import { LuSearch } from "react-icons/lu"
import { MdSkipPrevious, MdSkipNext, MdOutlineRepeat, MdVolumeUp, MdVolumeOff } from "react-icons/md";

import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

const cookies = new Cookies();

let currentSong = document.createElement('audio');

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

//Displays the song image in the music player.
function displaySongImage(pictureId){
    if(cookies.get("pictures") !== undefined && document.getElementById("imageSource") !== null){
        document.getElementById("imageSource").src = `https://res.cloudinary.com/${cloud_name}/image/upload/w_65,h_65,c_fill,q_100/${pictureId}`;
    }else{
        document.getElementById("songCoverBackground").outerHTML = `<div id="songCover"><img class="songImageCover" id="imageSource" src="https://res.cloudinary.com/${cloud_name}/image/upload/w_65,h_65,c_fill,q_100/${pictureId}"></div>`;
    }
}

export default function RootLayout(){
    const [songTitle, setSongTitle] = useState("");
    const [songArtist, setSongArtist] = useState("");
    
    const [beginningTime, setBeginningTime] = useState("0:00");

    const [songSlider, setSongSlider] = useState(); //delete this
    const [songSliderRef, setSongSliderRef] = useState(null);
    const [songSliderMax, setSongSliderMax] = useState();

    const [currentTrack, setCurrentTrack] = useState("");
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [volume, setVolume] = useState(20)

    const [time, setTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    const [play_pause, setPlayPause] = useState("play_arrow");

    const audioRef = useRef(null);

    const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"]

    const [search, setSearch] = useState()

    //For some reason putting this outside the function breaks the website.
    const navigate = useNavigate();
    const [username, setUsername] = useState(useLoaderData());

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
    
        cookies.set("song", trackId, {path: '/', maxAge: 1000*60*60*24*30});
        cookies.set("pictures", pictureId, {path: '/', maxAge: 1000*60*60*24*30});
    
        cancelAnimationFrame(interval);
        displaySongImage(pictureId);
        currentSong.play();
    
        document.getElementById(trackId).innerHTML = "pause_circle";
        setPlayPause("pause");
    
        lastPlayedTrack = trackId;
    }

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
        setPlayPause("play_arrow");        
    }

    function repeat(){
        setIsRepeat(prev => !prev)
        currentSong.loop = !currentSong.loop
    }

    function mute(){
        if(currentSong.volume !== 0){
            setVolume(0)
            lastVolume = currentSong.volume;
            currentSong.volume = 0;
        }else{
            currentSong.volume = lastVolume;
            calculateVolume(currentSong.volume);
            document.getElementById("volumeSlider").value = lastVolume * 100;
        }
    }

    function logout(){
        pauseSong(lastPlayedTrack);
        currentSong.src = "";
    
        let xhttp = new XMLHttpRequest();
    
        xhttp.open("POST", "http://localhost:5000/logout", false);
        xhttp.withCredentials = true;
        xhttp.send();

        setUsername(null)
    }

    function switchFunction(trackId, pictureId, username, title){
        if(trackId !== lastPlayedTrack || currentSong.paused){
            if(trackId !== lastPlayedTrack){
                setSongTitle(title);
                setSongArtist(username);
                cookies.set("title", title, {path: '/', maxAge: 1000*60*60*24*30});
                cookies.set("artist", username, {path: '/', maxAge: 1000*60*60*24*30});
            }
            playSong(trackId, pictureId);
            interval = requestAnimationFrame(updateTimeStamp);
        }else{
            pauseSong(trackId);
        }
    }

    function footerSwitchFunction(){
        if(currentSong.src === ""){
            return;
        }
        if(currentSong.paused){
            cancelAnimationFrame(interval);
            currentSong.play();
            interval = requestAnimationFrame(updateTimeStamp);
            setPlayPause("pause");
            
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
            setSongSlider((currentSong.currentTime / currentSong.duration) * (currentSong.duration * 1000));
            setBeginningTime(calculateTime(currentSong.currentTime));
        }
    }

    function handleSongSliderInput(e){
        const newValue = e.target.value;
        setSongSlider(newValue);
        setBeginningTime(calculateTime(newValue / 1000));

        if(!currentSong.paused){
            cancelAnimationFrame(interval);
        }
    }

    /*After the user changes the song range, it'll update the time.*/
    function handleSongSliderChange(e){
        const newValue = e.target.value;
        setSongSlider(newValue);
        
        if(currentSong.src !== ""){
            currentSong.currentTime = currentSong.duration * (songSlider / (currentSong.duration * 1000));
        }

        if(!currentSong.paused){
            requestAnimationFrame(updateTimeStamp);
        }
    }

    function pickPalette(name){
        const index = name.charCodeAt(0) % colorPalette.length
        return colorPalette[index]
    }

    function searchSong(){    
        if(search !== ""){
            navigate(`/search/${search}`);
        }
    }

    function HeaderConditional(){
        console.log(username)
        console.log("this")
        console.log("This is the cookie value: " + cookies.get("sessionId"))
        if (username === null){
            return(
                <>
                    <SignUp setUsername={setUsername}/>
                    <Login setUsername={setUsername}/>
                </>
            )
        }else{
            return(
                <>
                    <Avatar name={username} colorPalette={pickPalette(username)} />
                    <Stack gap="0">
                        <Text fontWeight="medium">{username}</Text>
                        <Text color="fg.muted" textStyle="sm">{username}</Text>
                    </Stack>
                    <Button size="lg" colorPalette="teal" variant="solid" onClick={() => logout()}>Log out</Button>
                </>
            )
        }
    }

    console.log("test");

    useEffect(() => {
        const audio = new Audio(currentTrack);

        let volumeSlider = document.getElementById("volumeSlider");

        if(currentSong.src === ""){
            if(cookies.get("title") === undefined || cookies.get("artist") === undefined || cookies.get("song") === undefined){
                setSongTitle("Song Title");
                setSongArtist("Artist");
            }else{
                setSongTitle(cookies.get("title"));
                setSongArtist(cookies.get("artist"));
                currentSong.src = `https://res.cloudinary.com/${cloud_name}/video/upload/${cookies.get("song")}`;
                currentSong.load();
                lastPlayedTrack = cookies.get("song");
            }
        }
    
        /*Output the total duration of the song*/
        currentSong.onloadedmetadata = function(){
            setEndTime(calculateTime(currentSong.duration));
            setSongSliderMax(Math.floor(currentSong.duration * 1000));
        };

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

    useEffect(() => {

    }, []);

    return(
        <>
            <main>
                <Grid
                    color='white'
                    templateRows={{base: "repeat()", md: "repeat(3, 1fr)"}}
                    templateColumns={{md: "repeat(8, 1fr)"}}
                    gap={4}
                    width='80%'
                    margin='auto'
                    maxWidth={1800}
                >
                    <GridItem minHeight="100vh" rowSpan={{base: 2, md: 3}} colSpan={{base: 7, md: 5}}>
                        <HStack h="80px">
                            <VStack>
                                <Heading marginLeft={3} color="#D9D9D9" fontSize={40}>Browse</Heading>
                            </VStack>
                            <Spacer/>
                            <InputGroup flex="1" startElement={<LuSearch/>} endElement={<Kbd>Enter</Kbd>}>
                                <Input
                                    placeholder="Search"
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => {if(e.key === "Enter") searchSong()}}
                                />
                            </InputGroup>
                        </HStack>
                        <Outlet context = {{switchFunction, like, lastPlayedTrack, username}}/>
                    </GridItem>

                    <GridItem minHeight="100vh" rowSpan={{base: 1, md: 3}} colSpan={{base: 7, md: 2}} marginRight={3}>
                        <HStack h="80px">
                            <Spacer/>
                            <HeaderConditional />
                        </HStack>
                        <Box height="300px" bg='#322C23' shadow="md" borderRadius={10}>
                            <Heading marginLeft={5} paddingTop={3} fontSize={20} color="#D9D9D9">Likes</Heading>
                        </Box>
                        <Box height="300px" bg='#322C23' shadow="md" borderRadius={10} marginTop={5}>
                            <Heading marginLeft={5} paddingTop={3} fontSize={20} color="#D9D9D9">History</Heading>
                        </Box>
                    </GridItem>
                </Grid>
            </main>

            <footer>
                <div id="audioDiv"></div>
                <div className="controls">
                    <MdSkipPrevious/>
                    <i className="material-symbols-rounded iconStyles controlsIcon" style={{fontSize: "35px"}} id="play_arrow" onClick={() => footerSwitchFunction()}>{play_pause}</i>
                    <MdSkipNext/>
                    <button onClick={repeat}>
                        <MdOutlineRepeat style={{color: isRepeat ? "lightblue" : ""}}/>
                    </button>
                </div>
                <div className="musicDetails">
                    {
                        (() => {
                            if(cookies.get("pictures") === undefined){
                                return(
                                    <div id="songCoverBackground">
                                        <i className="material-symbols-rounded iconStyles" style={{fontSize:"25px"}}>headphones</i>
                                    </div>
                                )
                            }else{
                                return(
                                    <div id="songCover">
                                        <img className="songImageCover" id="imageSource" src={`https://res.cloudinary.com/${cloud_name}/image/upload/w_65,h_65,c_fill,q_100/${cookies.get("pictures")}`}></img>
                                    </div>
                                )
                            }
                        })()
                    }
                    <div className="titleAndArtist">
                        <p className="musicPlayerTitle">{songTitle}</p>
                        <p className="musicPlayerArtist">{songArtist}</p>
                        <div className="timeStamp">
                            <p className="beginningTime">{beginningTime}</p>
                            <Slider
                                className="w-full max-w-xl"
                                value={[songSlider]}
                                min={[0]}
                                max={[songSliderMax]}
                                defaultValue={[0]}
                                onValueCommit={handleSongSliderChange}
                            />
                            <p className="endTime">{endTime}</p>
                        </div>
                    </div>
                </div>
                <div className="volumeControls">
                    <button onClick={() => mute()}>
                        {calculateVolume(volume)}
                    </button>
                <Slider
                    className="w-full max-w-xl"
                    defaultValue={[30]}
                    value={[volume]}
                    onValueChange={(e) => setVolume(e)}
                    max={100}
                    step={1}
                />
                <input id="volumeSlider" type="range" min="0" max="100" defaultValue="80" />
                </div>
            </footer>
        </>
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