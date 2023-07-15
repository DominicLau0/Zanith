import React, { useEffect } from 'react';
import { useParams, useLoaderData, useOutletContext } from 'react-router-dom';
import DisplaySong from "../Reusable_Functions/display_song.js";
import axios from 'axios';
import Cropper from 'cropperjs';

let cropper;

const profileBannerImage = (event) => {
    let profileHeaderPicture = document.getElementById("profileHeaderPicture");

    if(event.target.files[0]){
        let urlObject = URL.createObjectURL(event.target.files[0]);
        let image = document.createElement("img");

        image.addEventListener("load", () => {
            URL.revokeObjectURL(urlObject);
        });

        profileHeaderPicture.appendChild(image);

        image.controls = "true";
        image.src = urlObject;
        image.style.width = "1900px";
        image.style.height="100%";
        image.style.objectFit = "fill";
        image.style.display = "block";
        image.style.maxWidth = "100%";
        image.id = "displayImage";
    }

    const image = document.getElementById('displayImage');

    cropper = new Cropper(image, {
        autoCrop: true,
        aspectRatio: 10,
        minCropBoxWidth: 30,
        minCropBoxHeight: 1000,
        viewMode: 1
    });

    let button = document.createElement("button");
    button.id = "replaceImage";
    button.textContent = "Replace Image";
    button.setAttribute('onclick', "replaceImage()");
    profileHeaderPicture.appendChild(button);
}

function replaceImage(){
    let source = document.getElementById('displayImage').src;
    let profileHeaderPicture = document.getElementById("profileHeaderPicture");

    let image = cropper.getCroppedCanvas({maxWidth: 4096, maxHeight: 4096}).toDataUrl("image/png");

    alert(image);

    let createImage = document.createElement("img");
    createImage.src = image;

    //cropper.destroy();

    profileHeaderPicture.appendChild(createImage);
}

export default function ArtistName(){
    const { artistName } = useParams()

	useEffect(() => {
		document.title = artistName + ' on Zanith';
	}, []);

    let { switchFunction, like, lastPlayedTrack, username }  = useOutletContext();
    const songs = useLoaderData();

    return (
        <>  
            <div id="profileHeaderPicture">
                <h2 className="authenticationTitle">{artistName}</h2>
                {/*<input className="songUpload" type="file" id="bannerImage" name="bannerImage" onChange={profileBannerImage} accept="image/*" />*/}
            </div>
            <div className="profileContainer">
                <div className="songDisplay">
                    <h3>Songs</h3>
                    <hr />
                    <DisplaySong songs={songs} switchFunction={switchFunction} like={like} lastPlayedTrack={lastPlayedTrack} username={username}/>
                </div>
            </div>
        </>
    )
}

export const artistLoader = async ({ params }) => {
    const { artistName } = params;

	const res = await axios.get(`https://puzzled-worm-sweater.cyclic.app/profile/${artistName}`, {withCredentials: true});

	return res.data;
}