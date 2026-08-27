import React, { useEffect } from 'react'
import { useParams, useLoaderData, useOutletContext, useNavigate } from 'react-router-dom';
import DisplaySong from "../Reusable_Functions/display_song.js"
import axios from 'axios';
import { MdAccountCircle, MdError } from "react-icons/md";
import { Separator } from "@/components/ui/separator"

function RenderSearch({ songs }){
    let { switchFunction, like, lastPlayedTrack }  = useOutletContext();

    const navigate = useNavigate();

    if(songs.artist.length !== 0){
        return(
            <div className="flex items-center cursor-pointer w-80 rounded-xl mt-3 p-3 bg-stone-400" onClick={() => navigate(`/profile/${songs.artist}`)}>
                <MdAccountCircle className="size-10 object-scale-down"/>
                <p className="mx-4 text-xl font-semibold tracking-tight">{songs.artist}</p>
            </div>
        )
    }
    if(songs.songs.length !== 0){
        return(
            <DisplaySong songs={songs} switchFunction={switchFunction} like={like} lastPlayedTrack={lastPlayedTrack}/>
        )
    }
    if(songs.artist.length === 0 && songs.songs.length === 0){
        return(
            <div className='flex items-center'>
                <MdError />
                <p className="tracking-tight">No Results Found</p>
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
            <h2 className="text-lg font-semibold tracking-tight">Search results for "{searchValue}"</h2>
            <Separator/>
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