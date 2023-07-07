import React, { useEffect } from 'react'
import { useParams, useLoaderData, useOutletContext } from 'react-router-dom';
import DisplaySong from "../Reusable_Functions/display_song.js"
import axios from 'axios';

export default function ArtistName(){
    const { artistName } = useParams()

	useEffect(() => {
		document.title = artistName + ' on Zanith';
	}, []);

    let { switchFunction, like, lastPlayedTrack }  = useOutletContext();
    const songs = useLoaderData();

    return (
        <>  
            <div id="profileHeaderPicture">
                <h2 className="authenticationTitle">{artistName}</h2>
                {/*<input className="songUpload" type="file" id="bannerImage" name="bannerImage" onchange="profileBannerImage()" accept="image/*" />*/}
            </div>
            <div className="profileContainer">
                <div className="songDisplay">
                    <h3>Songs</h3>
                    <hr />
                    <DisplaySong songs={songs} switchFunction={switchFunction} like={like} lastPlayedTrack={lastPlayedTrack}/>
                </div>
            </div>
        </>
    )
}

export const artistLoader = async ({ params }) => {
    const { artistName } = params;

	const res = await axios.get(`http://localhost:5000/profile/${artistName}`, {withCredentials: true});

	return res.data;
}