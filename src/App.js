import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import React from'react';
import './styles.css';

import Main from './pages/Main.js'
import Login from './pages/Login.js'
import SignUp from './pages/SignUp.js'
import Home, {homeLoader} from './pages/Home.js';
import Upload from './pages/Upload.js';
import ArtistName, {artistLoader} from './pages/ArtistName.js'
import LabelName from './pages/LabelName.js'

import RootLayout from './layouts/RootLayout'

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/">
			<Route index element={<Main/>} />
			<Route path="login" element={<Login/>} />
			<Route path="signup" element={<SignUp/>} />

			<Route element={<RootLayout/>}>
				<Route path="home" element={<Home/>} loader={homeLoader}/>
				<Route path="upload" element={<Upload/>}/>
				<Route path="profile/:artistName" element={<ArtistName/>} loader={artistLoader} />
				<Route path="recordlabel/:labelName" element={<LabelName/>} />
			</Route>
		</Route>
	)
)

function App() {
	return (
		<RouterProvider router={router}/>
  );
}

export default App;