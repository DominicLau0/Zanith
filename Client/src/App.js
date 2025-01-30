import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import React from'react';
import './styles.css';

import Main, {mainLoader} from './pages/Main.js'
import Login from './pages/Login.js'
import SignUp from './pages/SignUp.js'
import Home, {homeLoader} from './pages/Home.js';
import Upload from './pages/Upload.js';
import Profile, {artistLoader} from './pages/Profile.js'
import RecordLabel from './pages/RecordLabel.js'
import Search, {searchLoader} from './pages/Search.js'
import Song, {songLoader} from './pages/Song.js'
import PageNotFound from './pages/PageNotFound'

import RootLayout, {rootLoader} from './layouts/RootLayout'

import { Provider } from './components/ui/provider';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route element={<RootLayout/>} loader={rootLoader}>
                <Route index element={<Home/>} loader={homeLoader}/>
                <Route path="upload" element={<Upload/>}/>
                <Route path="profile/:artistName" element={<Profile/>} loader={artistLoader} />
                <Route path="recordlabel/:labelName" element={<RecordLabel/>} />
                <Route path="search/:searchValue" element={<Search/>} loader={searchLoader}/>
                <Route path="/song/:songName" element={<Song/>} loader={songLoader}/>
                <Route path="*" element={<PageNotFound/>}/>
            </Route>
        </Route>
    )
)

function App() {
    return (
        <Provider>
            <RouterProvider router={router}/>
        </Provider>
    );
}

export default App;