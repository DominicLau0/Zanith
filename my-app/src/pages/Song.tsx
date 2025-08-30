import React from 'react'
import { useLoaderData, NavLink, useLocation } from "react-router-dom"
import { useEffect, useState } from 'react';
import axios from 'axios';
import DisplayComments from "../Reusable_Functions/display_comments.jsx";
import ReactModal from 'react-modal';

import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FaPlay } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

const api_key = "938647316156691";
const cloud_name = "dw5heht2b";

let songFile = null;
let imageFile = null;

//Source: https://github.com/LearnWebCode/cloudinary-finished-reference
async function submitSongs(submit){
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let genre = document.getElementById("genre").value;

    //Clear the system message
    document.getElementById("titleMessageUpload").innerHTML = "";
    document.getElementById("descriptionMessageUpload").innerHTML = "";
    document.getElementById("genreMessageUpload").innerHTML = "";

    //Check that all the fields are completed
    if(title === ""){
        document.getElementById("titleMessageUpload").innerHTML = "<p>Enter a title.<p>";
    }
    if(description === ""){
        document.getElementById("descriptionMessageUpload").innerHTML = "<p>Enter a description.<p>";
    }
    if(genre === ""){
        document.getElementById("genreMessageUpload").innerHTML = "<p>Enter a genre.<p>";
    }
    
    //Upload song to Cloudinary
    if(submit===true && title !== "" && description !== "" && genre !== "" && songFile !== null && imageFile !== null){
        //Lock text and other elements
        document.getElementById("title").disabled = true;
        document.getElementById("genre").disabled = true;
        document.getElementById("description").disabled = true;
        document.getElementById("imageFile").disabled = true;
        document.getElementById("songFile").disabled = true;
        document.getElementById("uploadSong").disabled = true;

        //Get signature from the server.
        const signatureResponse = await axios.get("http://localhost:5000/signature", {withCredentials: true});

        //Upload the song
        //Append the data together to submit to cloudinary along with the song.
        const song = new FormData();
        song.append("file", songFile);
        song.append("api_key", api_key);
        song.append("signature", signatureResponse.data.signature);
        song.append("timestamp", signatureResponse.data.timestamp);

        //Upload to Cloudinary
        const song_cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, song, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: function (e) {
                document.getElementById("progressBar").style.width = (e.loaded/e.total)*100 + "%";
            }
        })
        console.log(song_cloudinaryResponse.data)

        //Upload the image
        //Append the data together to submit to cloudinary along with the song.
        const image = new FormData();
        image.append("file", imageFile);
        image.append("api_key", api_key);
        image.append("signature", signatureResponse.data.signature);
        image.append("timestamp", signatureResponse.data.timestamp)

        //Upload to Cloudinary
        const image_cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, image, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: function (e) {
                console.log(e.loaded / e.total)
            }
        })
        console.log(image_cloudinaryResponse.data)

        //Get uploaded song info and post it to the server to mongoose.
        let date = new Date();

        const songData = {
            username: signatureResponse.data.username,
            title: title,
            description: description,
            genre: genre,
            date: date,
            song_public_id: song_cloudinaryResponse.data.public_id,
            song_version: song_cloudinaryResponse.data.version,
            song_signature: song_cloudinaryResponse.data.signature,
            image_public_id: image_cloudinaryResponse.data.public_id,
            image_version: image_cloudinaryResponse.data.version,
            image_signature: image_cloudinaryResponse.data.signature
        }
        await axios.post("http://localhost:5000/upload", songData, {withCredentials: true})
        
        /*Unlock text and other elements, as well as emptying the fields*/

        document.getElementById("title").value = "";
        document.getElementById("genre").value = "";
        document.getElementById("description").value = "";

        document.getElementById("displaySong").style.display = "none";
        document.getElementById("displayImage").style.display = "none";

        document.getElementById("title").disabled = false;
        document.getElementById("genre").disabled = false;
        document.getElementById("description").disabled = false;
        document.getElementById("imageFile").disabled = false;
        document.getElementById("songFile").disabled = false;
        document.getElementById("uploadSong").disabled = false;
    }
}

const displaySong = (event) => {
    let songUploadMessage = document.getElementById("songUploadMessageUpload");

    if (!event.target.files[0]) {
        songUploadMessage.innerHTML = "<p>No files have been selected.</p>";
    }else{
        songFile = event.target.files[0];

        songUploadMessage.innerHTML = "";

        let urlObject = URL.createObjectURL(event.target.files[0]);
        let audio = document.createElement("audio");

        audio.addEventListener("load", () => {
            URL.revokeObjectURL(urlObject);
        });

        songUploadMessage.appendChild(audio);

        audio.controls = "true";
        audio.src = urlObject;
        audio.id = "displaySong";
    }
}

const displayImage = (event) => {
    let imageUploadMessage = document.getElementById("imageUploadMessageUpload");

    if(!event.target.files[0]){
        imageUploadMessage.innerHTML = "<p>No files have been selected.</p>";
    }else{
        imageFile = event.target.files[0];

        imageUploadMessage.innerHTML = "";

        let urlObject = URL.createObjectURL(event.target.files[0]);
        let image = document.createElement("img");

        image.addEventListener("load", () => {
            URL.revokeObjectURL(urlObject);
        });

        imageUploadMessage.appendChild(image);

        image.controls = "true";
        image.src = urlObject;
        image.style.width = "322px";
        image.style.height="322px";
        image.id = "displayImage";
    }
}

export default function Song(){
    const [isOpen, setIsOpen] = useState(false);

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
    
        xhttp.open("POST", "http://localhost:5000/like", false);
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
    
        xhttp.open("POST", "http://localhost:5000/comment", false);
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
    
        xhttp.open("POST", "http://localhost:5000/deleteComment", false);
        xhttp.withCredentials = true;
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({commentId: commentId, song: song.song[0].song}));
    }

    useEffect(() => {
        document.title = song.song[0].title + " by " + song.song[0].username;

        scrollToComments();

        document.body.classList.add("profileSongBody");
        return () => {
            document.body.classList.remove("profileSongBody");
        }
    }, []);

    return (
        <>
            <div className="flex bg-zinc-300 dark:bg-zinc-600 rounded-xl mr-8">
                <img className="rounded-xl m-4" src={`https://res.cloudinary.com/${cloud_name}/image/upload/w_200,h_200,c_fill,q_100/${song.song[0].picture}`}  alt={`${song.song[0].title}`}/>
                <div className="m-2">
                    <div className="flex">
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold tracking-tight">{song.song[0].title}</h1>
                            <NavLink to={"/profile/" + song.song[0].username} className="tracking-tight" style={{display: "inline-block"}}>{song.song[0].username}</NavLink>
                        </div>
                        <div className="flex-2">
                            {
                                (() => {
                                    let date = new Date(song.song[0].date);

                                    return(
                                        <h2 className="dateSongStyle" title={date.toString()}>{date.toDateString()}</h2>
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
                                        return(<Badge variant="secondary">{song.song[0].genre}</Badge>)
                                    }else if(song.song[0].genre === "Hip Hop"){
                                        return(<span className="genreDark genreHipHop">{song.song[0].genre}</span>)
                                    }else if(song.song[0].genre === "Rap"){
                                        return(<span className="genreDark genreRap">{song.song[0].genre}</span>)
                                    }else{
                                        return(<Badge>{song.song[0].genre}</Badge>)
                                    }
                                })()
                            }
                        </div>
                    </div>
                    {/*<button>Play</button>*/}
                    <div className="flex">
                        <div className="flex items-center">
                            <FaPlay/>
                            <span className="ml-1">{song.song[0].listens}</span>
                        </div>
                        <Button className='flex cursor-pointer ml-2' onClick={() => like()}>
                            {song.song[0].likes.includes(song.username) ? (
                                <MdFavorite className="fill-red-400"/>
                            ) : (
                                <MdFavorite/>
                            )}
                            <span>{song.song[0].likes.length}</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="profileContainer">
                <div className="mr-8">
                    <div className="bg-slate-400 dark:bg-slate-600 rounded-lg mt-4">
                        <h3 className='p-2 text-xl font-semibold tracking-tight'>Description</h3>
                        {
                            (() => {
                                if(song.username === song.song[0].username){
                                    return(
                                        <>
                                            <button className='editSongButton submitSong' onClick={() => setIsOpen(true)}><span className="editSongIcon material-symbols-outlined">edit</span>Edit</button>
                                            <ReactModal
                                                isOpen={isOpen}
                                                contentLabel='Edit Song Info'
                                                onRequestClose={() => setIsOpen(false)}
                                                closeTimeoutMS={250}
                                                className="backgroundOverlay"
                                                overlayClassName="editOverLay"
                                                ariaHideApp={false}
                                            >
                                            <div className="songInfo">
                                                <h2 id="authenticationTitle">Edit Song Info</h2>
                                                <label className="authenticationLabel" htmlFor="title">Song Title</label>
                                                <br/>
                                                <input className="textbox" type="text" id="title" name="title" onKeyUp={submitSongs} placeholder="Song Title" defaultValue={song.song[0].title}/>
                                                <div id="titleMessageUpload"></div>
                                                <label className="authenticationLabel" htmlFor="genre">Genre</label>
                                                <br/>
                                                <input className="textbox" list="genreList" id="genre" onKeyUp={submitSongs} placeholder="Select the genre" defaultValue={song.song[0].genre}/>
                                                <datalist id="genreList">
                                                    <option value="Classical"></option>
                                                    <option value="Rock"></option>
                                                    <option value="Electronic"></option>
                                                    <option value="Hip hop"> </option>
                                                    <option value="Rap"></option>
                                                </datalist>
                                                <div id="genreMessageUpload"></div>
                                                <label className="authenticationLabel" htmlFor="description">Description</label>
                                                <br/>
                                                <textarea className="textbox" id="description" name="description" onKeyUp={submitSongs} placeholder="Enter some descriptions" defaultValue={song.song[0].description}></textarea>
                                                <div id="descriptionMessageUpload"></div>
                                                <button className="submitSongs authenticationMargin" type="button" onClick={() => submitSongs(true)} id="uploadSong">Save Changes</button>
                                            </div>
                                            <div className="displayCover">
                                                <div className="displayImageSong">
                                                    <div className="displayImage">
                                                        <label className="authenticationLabel" htmlFor="imageFile">Upload Your Image</label>
                                                        <br/>
                                                        <input className="songUpload" type="file" id="imageFile" name="imageFile" onChange={displayImage} accept="image/*"/>
                                                        <div id="imageUploadMessageUpload"></div>
                                                    </div>
                                                    <div className="displaySongs">
                                                        <label className="authenticationLabel" htmlFor="songFile">Upload Your Song</label>
                                                        <br/>
                                                        <input className="songUpload" type="file" id="songFile" name="songfile" onChange={displaySong} accept="audio/*"/>
                                                        <div id="songUploadMessageUpload"></div>
                                                    </div>
                                                </div>
                                                <div className="progressSection"> 
                                                    <p>Progress:</p>
                                                    <div className="progressTemplate">
                                                        <div id="progressBar"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            </ReactModal>
                                        </>
                                    )
                                }
                            })()
                        }
                        <pre className="p-2 pt-0 font-sans tracking-tight">{song.song[0].description}</pre>
                    </div>
                    <h3 className="p-2 text-xl font-semibold tracking-tight">{numberOfComments} Comments</h3>
                    <Textarea placeholder="Add a comment..." onChange={e => setComments(e.target.value)}/>
                    <Button className='mt-2' onClick={comment}>Comment</Button>
                    <DisplayComments song={song} deleteComment={deleteComment} commentState={commentState}/>
                </div>
            </div>
        </>
    )
}

export const songLoader = async ({ params }) => {
    const { songName } = params;

    const res = await axios.get(`http://localhost:5000/song/${songName}`, {withCredentials: true});

    return res.data;
}