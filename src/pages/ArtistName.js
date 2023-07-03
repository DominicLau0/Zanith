import React from 'react'
import { useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom';

export default function ArtistName(){
    const { artistName } = useParams()

	useLayoutEffect(() => {
		document.title = artistName + ' on Zanith'
	}, []);

    return (
        <>  
            <div id="profileHeaderPicture">
                <h2 className="authenticationTitle">{artistName}</h2>
                {/*<input className="songUpload" type="file" id="bannerImage" name="bannerImage" onchange="profileBannerImage()" accept="image/*" />*/}
            </div>
            <div className="profileContainer">
                <div className="songDisplay">
                    <h3>Songs</h3>
                    <hr />
                    <div className="songContainer"></div>
                </div>
            </div>
        </>
    )
}