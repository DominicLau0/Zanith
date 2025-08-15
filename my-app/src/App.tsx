import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import React from'react';
import './styles.css';

import Main, {mainLoader} from './pages/Main.tsx'
import Login from './pages/Login.tsx'
import SignUp from './pages/SignUp.tsx'
import Home, {homeLoader} from './pages/Home.tsx';
import Upload from './pages/Upload.tsx';
import Profile, {artistLoader} from './pages/Profile.tsx'
import RecordLabel from './pages/RecordLabel.tsx'
import Search, {searchLoader} from './pages/Search.tsx'
import Song, {songLoader} from './pages/Song.tsx'
import PageNotFound from './pages/PageNotFound.tsx'

import RootLayout, {rootLoader} from './layouts/RootLayout.tsx'

import { Provider } from './components/ui/provider.jsx';

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
            <RouterProvider router={router}/>
    );
}

export default App;