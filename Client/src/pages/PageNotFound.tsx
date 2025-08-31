import { useEffect } from 'react';
import { MdErrorOutline  } from "react-icons/md"

export default function Song(){
    useEffect(() => {
        document.title = "404 Not Found";
    }, []);

    return (
        <h1 className='pageNotFound'>404 Not Found. Page Unavailable.</h1>
    )
}