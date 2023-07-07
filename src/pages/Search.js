import React, { useEffect } from 'react'
import { useParams, useLoaderData, useOutletContext, useNavigate } from 'react-router-dom';
import DisplaySong from "../Reusable_Functions/display_song.js"
import axios from 'axios';

export default function Search(){
    const { searchValue } = useParams()

	useEffect(() => {
        document.body.classList.add("searchBody");
		return () => {
			document.body.classList.remove("searchBody");
		}
	}, []);

    document.title = searchValue + ' results on Zanith';

    let { switchFunction, like, lastPlayedTrack }  = useOutletContext();
    const songs = useLoaderData();

    const navigate = useNavigate();

    return (
        <>  
            <div className='searchDisplay'>
                <h2>Search results for "{searchValue}"</h2>
                <hr />
                {
                    (() => {
                        if(songs.artist.length !== 0){
                            return(
                                <>
                                    <h3>Artists</h3>
                                    <div className="searchArtistContainer" onClick={() => navigate(`/profile/${searchValue}`)}>
                                        <i style={{fontSize:"40px", marginLeft: "20px"}} className="material-symbols-outlined iconStyles">account_circle</i>
                                        <p style={{marginLeft: "10px"}}>{searchValue}</p>
                                    </div>
                                </>
                            )
                        }
                    })()
                }
                {
                    (() => {
                        if(songs.songs.length !== 0){
                            return(
                                <>
                                    <h3>Songs</h3>
                                    <DisplaySong songs={songs} switchFunction={switchFunction} like={like} lastPlayedTrack={lastPlayedTrack}/>
                                </>
                            )
                        }
                    })()
                }
                                {
                    (() => {
                        if(songs.artist.length === 0 && songs.songs.length === 0){
                            return(
                                <>
                                    <div className='noResults'>
                                        <i style={{fontSize: "50px"}} className="material-symbols-outlined iconStyles">error</i>
                                        <p style={{fontSize: "30px"}}>No Results Found</p>
                                    </div>
                                </>
                            )
                        }
                    })()
                }                
            </div>
        </>
    )
}

export const searchLoader = async ({ params }) => {
    const { searchValue } = params;

	const res = await axios.get(`http://localhost:5000/search/${searchValue}`, {withCredentials: true});

	return res.data;
}