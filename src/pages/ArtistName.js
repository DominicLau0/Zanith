import React from 'react'
import { useLayoutEffect } from 'react'
import { useParams, useLoaderData, useOutletContext } from 'react-router-dom';
import DisplaySong from "../Reusable_Functions/display_song.js"
import axios from 'axios';

export default function ArtistName(){
    const { artistName } = useParams()

	useLayoutEffect(() => {
		document.title = artistName + ' on Zanith'
	}, []);

    let { switchFunction, like }  = useOutletContext();
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
                    <DisplaySong songs={songs} switchFunction={switchFunction} like={like}/>
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