import React from 'react'
import { useEffect } from 'react'
import RecordLabelImage from "../images/record-label.jpg"
import { NavLink, useNavigate, useLoaderData, useOutletContext } from "react-router-dom"
import axios from "axios"
import DisplaySong from "../Reusable_Functions/display_song.js"
import HomeIcon from "../icons/home.png"

export default function Home(){
    useEffect(() => {
        document.title = "Home";
    }, []);

    let { switchFunction, like, lastPlayedTrack, username }  = useOutletContext();

    const navigate = useNavigate();
    const songs = useLoaderData();

    return (
        <>  

            {/*
            <div class = "pageContainer">
                <div className="menuBar">
                    <div className="menuItem">
                        <img src={HomeIcon} style={{color: "blue"}} alt="" />
                            Home
                    </div>
                    <div className="menuItem">
                        Upload
                    </div>
                    <div className="menuItem">
                        Profile
                    </div>
                </div>
                <div>
                    <div id="recordLabels">
                        <h2>Explore Record Labels </h2>
                        <NavLink to="../recordlabel/Dem%20Drop%20Records">
                            <img className="recordLabelImage" src={RecordLabelImage} alt="DemDropRecords"/>
                        </NavLink>
                    </div>
                    <br />
                    <div id="recommendedSongs">
                        <h2>Recommended Songs </h2>
                        <DisplaySong songs={songs} switchFunction={switchFunction} like={like} lastPlayedTrack={lastPlayedTrack} username={username}/>
                    </div>
                    <br />
                    <div id="topSongs">
                    </div>
                    <div id="recommendedArtists">
                        <h2>Artists you may like</h2>
                        <div className="searchArtistContainer" onClick={() => navigate(`/profile/MrObvious`)}>
                            <i className="material-symbols-outlined iconStyles" style={{fontSize:"40px", marginLeft:"20px"}}>account_circle</i>
                            <p style={{marginLeft: "10px"}}>MrObvious</p>
                        </div>
                    </div>
                </div>
            </div>
            */}
        </>
    )
}

export const homeLoader = async () => {
    try{
        const res = await axios.get("http://localhost:5000/root", {withCredentials: true});

        if(res.status === 200){
            const res = await axios.get("http://localhost:5000/home", {withCredentials: true});
            return res.data;
        }
    } catch (error) {
        return null;
    }
}