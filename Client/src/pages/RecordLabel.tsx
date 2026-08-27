import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';

export default function LabelName(){
    const { labelName } = useParams()

    useEffect(() => {
        document.title = labelName + ' on Zanith'
    }, []);

    return (
        <>  
            <div id="profileHeaderPicture" style={{backgroundColor: "lightsalmon"}}>
                    <h2 className="authenticationTitle">{ labelName }</h2>
                    {/*<input className="songUpload" type="file" id="bannerImage" name="bannerImage" onchange="profileBannerImage()" accept="image/*" />*/}
                </div>
                <div className="profileContainer">
                    <div className="songDisplay">
                        <h3>Artists</h3>
                        <hr />
                        <div className="songContainer"></div>
                    </div>
                </div>
        </>
    )
} 