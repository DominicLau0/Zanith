import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';

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

export default function Upload(){
	useEffect(() => {
		document.title = "Upload";
	}, []);

    return (
        <>     	
			<div className="uploadContainer">
				<div className="songInfo">
					<h2 id="authenticationTitle">Upload Songs</h2>
					<label className="authenticationLabel" htmlFor="title">Song Title</label>
					<br/>
					<input className="textbox" type="text" id="title" name="title" onKeyUp={submitSongs} placeholder="Song Title"/>
					<div id="titleMessageUpload"></div>
					<label className="authenticationLabel" htmlFor="genre">Genre</label>
					<br/>
					<input className="textbox" list="genreList" id="genre" onKeyUp={submitSongs} placeholder="Select the genre"/>
					<datalist id="genreList">
						<option value="classNameical"></option>
						<option value="Rock"></option>
						<option value="Electronic"></option>
						<option value="Hip hop"> </option>
						<option value="Rap"></option>
					</datalist>
					<div id="genreMessageUpload"></div>
					<label className="authenticationLabel" htmlFor="description">Description</label>
					<br/>
					<textarea className="textbox" id="description" name="description" onKeyUp={submitSongs} placeholder="Enter some descriptions"></textarea>
					<div id="descriptionMessageUpload"></div>
					<button className="submitSongs authenticationMargin" type="button" onClick={() => submitSongs(true)} id="uploadSong">Upload</button>
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
			</div>
        </>
    )
}