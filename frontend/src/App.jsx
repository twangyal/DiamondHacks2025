import './App.css';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard';
import Register from './Components/Register.jsx';
import Lander from './Components/Lander.jsx';
import Home from './Components/Home.jsx';
import Profile from './Components/Profile.jsx';
import Listings from './Components/Listings.jsx';
import CreateListing from './Components/CreateListing.jsx';
import Edit from './Components/Edit.jsx';
import Saved from './Components/Saved.jsx';
import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './styles.css';

function App() {

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Lander />} />
                <Route path="/login" element={<Login />} />         
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/create" element={<CreateListing />} />
                <Route path="/edit/:id" element={<Edit />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/profile" element= {<Profile />}/>

            </Routes>
        </div>
    );
}

export default App;
