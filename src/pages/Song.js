import React from 'react'
import { useLoaderData, NavLink, useLocation } from "react-router-dom"
import { useEffect, useState } from 'react';
import axios from 'axios';
import DisplayComments from "../Reusable_Functions/display_comments.js";

export default function Song(){
    const cloud_name = "dw5heht2b";
	const song = useLoaderData();

	const { hash } = useLocation();

	function scrollToComments(){
		if(hash === "#commentHeader"){
			document.getElementById("commentHeader").scrollIntoView();
		}
	}

	const [comments, setComments] = useState("");
	const [commentState, setCommentState] = useState(song.song[0].comments);
	const [numberOfComments, setNumberOfComments] = useState(song.song[0].comments.length);

	function like(){
		let likeAmount;
		let newLike;
	
		let xhttp = new XMLHttpRequest();
	
		xhttp.onreadystatechange = function(){
			if(this.readyState === 4 && this.status === 200){
				likeAmount = JSON.parse(this.responseText).like;
				newLike = JSON.parse(this.responseText).newLike;
				
				document.getElementById("likeButton").childNodes[0].nodeValue = likeAmount;
		
				if(newLike === true){
					document.getElementById(`likeButton`).className = "songListenCount likeButtonLiked";
				}else{
					document.getElementById(`likeButton`).className = "songListenCount likeButton";
				}
			}
		}
	
		xhttp.open("POST", "https://puzzled-worm-sweater.cyclic.app/like", false);
		xhttp.withCredentials = true;
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(JSON.stringify({song: song.song[0].song}));
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

    useEffect(() => {
		document.title = song.song[0].title + " by " + song.song[0].username;

		scrollToComments();
		
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
                <div className="songTopInfo">
                    <h1 className="songTitleFontSize">{song.song[0].title}
					{
						(() => {
							let date = new Date(song.song[0].date);

							return(
								<span className="dateSongStyle" title={date.toString()}>{date.toDateString()}</span>
							)
						})()
					}
					{
						(() => {
							if(song.song[0].genre === "Classical"){
								return(<span className="genreDark genreClassical">{song.song[0].genre}</span>)
							}else if(song.song[0].genre === "Rock"){
								return(<span className="genreDark genreRock">{song.song[0].genre}</span>)
							}else if(song.song[0].genre === "Electronic"){
								return(<span className="genreDark genreElectronicDark">{song.song[0].genre}</span>)
							}else if(song.song[0].genre === "Hip Hop"){
								return(<span className="genreDark genreHipHop">{song.song[0].genre}</span>)
							}else if(song.song[0].genre === "Rap"){
								return(<span className="genreDark genreRap">{song.song[0].genre}</span>)
							}else{
								return(<span className="genreDark genreOther">{song.song[0].genre}</span>)
							}
						})()
					}
					</h1>
					<NavLink to={"/profile/" + song.song[0].username} className="songArtistFontSize" style={{display: "inline-block"}}>{song.song[0].username}</NavLink>
					{/*<button>Play</button>*/}
					<div className="controls">
						<i className="songPlayIcon material-symbols-outlined">play_arrow</i>
						<span className="songListenCount">{song.song[0].listens}</span>
						{
							(() => {
								if(song.song[0].likes.includes(song.username)){
									return (
										<button className='songListenCount likeButtonLiked' id="likeButton" onClick={() => like()}>{song.song[0].likes.length}
											<i style={{fontSize:"20px", verticalAlign: "top", float: "left"}} className="material-symbols-outlined">favorite</i>
										</button>
									)
								}else{
									return(
										<button className='songListenCount likeButton' id="likeButton" onClick={() => like()}>{song.song[0].likes.length}
											<i style={{fontSize:"20px", verticalAlign: "top", float: "left"}} className="material-symbols-outlined">favorite</i>
										</button>
									)
								}
							})()
						}
					</div>
                </div>
            </div>
			<div className="profileContainer">
				<div className="songDisplay">
					<h3>Description</h3>
					<hr />
					<pre className="description">{song.song[0].description}</pre>
					<br/>
					<h3 id="commentHeader">{numberOfComments} Comments</h3>
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