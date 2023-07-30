import React, { createElement } from 'react'
import { useLoaderData, NavLink } from "react-router-dom"
import { useEffect, useState } from 'react';
import axios from 'axios';
import DisplayComments from "../Reusable_Functions/display_comments.js";

export default function Song(){
    const cloud_name = "dw5heht2b";
	const song = useLoaderData();

	const [comments, setComments] = useState("");
	const [commentState, setCommentState] = useState(song.song[0].comments);

    {commentState.map(comments => {
        comments.id = crypto.randomUUID();
    })}

    function deleteComment(commentId){
        let commentText = document.getElementById(commentId).textContent;
    
        let xhttp = new XMLHttpRequest();
    
        xhttp.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                const newComments = commentState.filter((item) => item[Object.keys(item)[0]] !== commentText);
                setCommentState(newComments);
            }
        }
    
        xhttp.open("POST", "https://puzzled-worm-sweater.cyclic.app/deleteComment", false);
        xhttp.withCredentials = true;
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({comment: commentText, song: song.song[0].song, date: new Date()}));
    }

	function comment(){
		if(comments === ""){
			return;
		}

		let xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function(){
			if(this.readyState === 4 && this.status === 200){
				let uuid = crypto.randomUUID();

				let commentText = {[song.username]: comments, "id": uuid};

				const newComments = [...commentState, commentText];
				setCommentState(newComments);

				document.getElementById("commentTextArea").value = "";
				setComments("");
			}
		}
	
		xhttp.open("POST", "https://puzzled-worm-sweater.cyclic.app/comment", false);
		xhttp.withCredentials = true;
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(JSON.stringify({comment: comments, song: song.song[0].song}));
	}

    useEffect(() => {
		document.title = song.song[0].title + " by " + song.song[0].username;
		
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
					<textarea className="comment" name="comment" onChange={e => setComments(e.target.value)} id="commentTextArea" placeholder="Comment on this song"></textarea>
					<div>
						<button className='submitSong' onClick={comment}>Comment</button>
					</div>
					<DisplayComments song={song} deleteComment={deleteComment} commentState={commentState}/>
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