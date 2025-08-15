import React, { useEffect } from 'react'
import { useParams, useLoaderData, useOutletContext, useNavigate } from 'react-router-dom';
import DisplaySong from "../Reusable_Functions/display_song.js"
import axios from 'axios';

function RenderSearch({ songs }){
    let { switchFunction, like, lastPlayedTrack }  = useOutletContext();

    const navigate = useNavigate();

    if(songs.artist.length !== 0){
        return(
            <>
                <h3>Artists</h3>
                <div className="searchArtistContainer" onClick={() => navigate(`/profile/${songs.artist}`)}>
                    <i style={{fontSize:"40px", marginLeft: "20px"}} className="material-symbols-outlined iconStyles">account_circle</i>
                    <p style={{marginLeft: "10px"}}>{songs.artist}</p>
                </div>
            </>
        )
    }
    if(songs.songs.length !== 0){
        return(
            <>
                <h3>Songs</h3>
                <DisplaySong songs={songs} switchFunction={switchFunction} like={like} lastPlayedTrack={lastPlayedTrack}/>
            </>
        )
    }
    if(songs.artist.length === 0 && songs.songs.length === 0){
        return(
            <div className='noResults'>
                <i style={{fontSize: "50px"}} className="material-symbols-outlined iconStyles">error</i>
                <p style={{fontSize: "30px"}}>No Results Found</p>
            </div>
        )
    }
}

export default function Search(){
    const { searchValue } = useParams();
    document.title = searchValue + ' results on Zanith';

    const songs = useLoaderData();

    return (
        <div className='searchDisplay'>
            <h2>Search results for "{searchValue}"</h2>
            <hr />
            <RenderSearch songs={songs} />
        </div>
    )
}

export const searchLoader = async ({ params }) => {
    const { searchValue } = params;

    const res = await axios.get(`http://localhost:5000/search/${searchValue}`, {withCredentials: true});
    console.log(res.data);

    return res.data;
}