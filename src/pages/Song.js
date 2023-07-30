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
	const [numberOfComments, setNumberOfComments] = useState(song.song[0].comments.length);

    function deleteComment(commentId){ 
        let xhttp = new XMLHttpRequest();
    
        xhttp.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                const newComments = commentState.filter((item) => item[Object.keys(item)[1]] !== commentId);
                setCommentState(newComments);
				setNumberOfComments(numberOfComments => --numberOfComments);
            }
        }
    
        xhttp.open("POST", "https://puzzled-worm-sweater.cyclic.app/deleteComment", false);
        xhttp.withCredentials = true;
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({commentId: commentId, song: song.song[0].song}));
    }

	function comment(){
		if(comments === ""){
			return;
		}

		let uuid = crypto.randomUUID();
		let date = new Date();
		let xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function(){
			if(this.readyState === 4 && this.status === 200){
				let commentText = {[song.username]: comments, "id": uuid, "date": date};

				const newComments = [...commentState, commentText];
				setCommentState(newComments);

				document.getElementById("commentTextArea").value = "";
				setComments("");
				setNumberOfComments(numberOfComments => ++numberOfComments);
			}
		}
	
		xhttp.open("POST", "https://puzzled-worm-sweater.cyclic.app/comment", false);
		xhttp.withCredentials = true;
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(JSON.stringify({comment: comments, song: song.song[0].song, uuid: uuid, date: date}));
	}

    useEffect(() => {
		document.title = song.song[0].title + " by " + song.song[0].username;
		
		let textarea = document.querySelector(".comment");
		textarea.addEventListener('input', autoResize, false);

		function autoResize() {
			let scrollLeft = window.scrollX ||
			(document.documentElement || document.body.parentNode || document.body).scrollLeft;

			let scrollTop  = window.scrollY ||
			(document.documentElement || document.body.parentNode || document.body).scrollTop;

			this.style.height = 'auto';
			this.style.height = this.scrollHeight + 'px';

			window.scrollTo(scrollLeft, scrollTop);
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
					<pre className="description">{song.song[0].description}</pre>
					<br/>
					<h3>{numberOfComments} Comments</h3>
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