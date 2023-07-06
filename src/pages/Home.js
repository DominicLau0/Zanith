import React from 'react'
import { useEffect } from 'react'
import RecordLabelImage from "../images/record-label.jpg"
import { NavLink, useNavigate, useLoaderData, useOutletContext } from "react-router-dom"
import axios from "axios"
import DisplaySong from "../Reusable_Functions/display_song.js"

export default function Home(){
	useEffect(() => {
		document.title = "Home";
		document.body.classList.add("searchBody");
	}, []);

	let { switchFunction, like }  = useOutletContext();

	const navigate = useNavigate();
	const songs = useLoaderData();

    return (
        <>        	
			<div id="recordLabels">
				<h2>Explore Record Labels </h2>
				<NavLink to="../recordlabel/Dem%20Drop%20Records">
					<img className="recordLabelImage" src={RecordLabelImage} alt="DemDropRecords"/>
				</NavLink>
			</div>
			<br />
			<div id="recommendedSongs">
				<h2>Recommended Songs </h2>
				<DisplaySong songs={songs} switchFunction={switchFunction} like={like}/>
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
        </>
    )
}

export const homeLoader = async () => {
	const res = await axios.get("http://localhost:5000/home", {withCredentials: true});

	return res.data;
}