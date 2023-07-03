import React from 'react'
import { Outlet } from "react-router-dom"
import axios from 'axios';

export default function Profile(){
    return (
		<Outlet/>
    )
}

export const profileLoader = async () => {
  const res = await axios.get("http://localhost:5000/signature", {withCredentials: true});

  return res.json();
}