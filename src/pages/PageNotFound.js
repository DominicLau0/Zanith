import React from 'react'
import { useEffect } from 'react';

export default function Song(){
    useEffect(() => {
		document.title = "404 Not Found";
	}, []);

    return (
        <>
            <h1 className='pageNotFound'>404 Not Found. Page Unavailable.</h1>
        </>
    )
}