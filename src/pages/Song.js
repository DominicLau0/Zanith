import React from 'react'
import { useLoaderData, NavLink } from "react-router-dom"
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Song(){
    const cloud_name = "dw5heht2b";

	const [comments, setComments] = useState("");

	function comment(){
		if(comments !== ""){
			document.getElementById("commentSection").innerHTML += `<div class="commentSection"><div class="commentBar"><p>${comments}</p></div><button class='commentButtonModifier' onclick="delete()">Delete</button></div><br>`;
		}
	}

    useEffect(() => {
		document.title = "Zanith";
		
		let textarea = document.querySelector(".comment");
		textarea.addEventListener('input', autoResize, false);

		function autoResize() {
			this.style.height = 'auto';
			this.style.height = this.scrollHeight + 'px';
		}

		document.body.classList.add("profileSongBody");
		return () => {
			document.body.classList.remove("profileSongBody");
		}
	}, []);

    const song = useLoaderData();

    return (
        <>
            <div className="songHeaderPicture">
				<img className="songCoverImage" src={`https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_300,c_fill,q_100/${song.song[0].picture}`}  alt={`${song.song[0].title}`}/>
                <div>
                    <h1 className="songTitleFontSize">{song.song[0].title}</h1>
					<NavLink to={"/profile/" + song.song[0].username} className="songArtistFontSize">{song.song[0].username}</NavLink>
                </div>
            </div>
			<div className="profileContainer">
				<div className="songDisplay">
					<h3>Description</h3>
					<hr />
					<p>{song.song[0].description}</p>
					<br/>
					<h3>Comments</h3>
					<hr />
					<textarea className="comment" name="comment" onChange={e => setComments(e.target.value)} placeholder="Comment on this song"></textarea>
					<div>
						<button className='submitSong' onClick={comment}>Comment</button>
					</div>
					<br/>
					<div id="commentSection">
					</div>
				</div>
			</div>
        </>
    )
}

export const songLoader = async ({ params }) => {
    const { songName } = params;

	const res = await axios.get(`https://puzzled-worm-sweater.cyclic.app/song/${songName}`, {withCredentials: true});

	return res.data;
}