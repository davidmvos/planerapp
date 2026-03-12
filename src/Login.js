import React, { useState, useEffect } from 'react';
import {checkLogin} from "./backend";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import InfoToast from './InfoToast';

import bootstrap from 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from 'react-router-dom';


const auth = getAuth();

function Login() {
    const navigate = useNavigate();

    // State to manage email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loggedIn, setLoggedIn] = useState(false);


    const handleLogin = (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log(checkLogin(email, password));
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setLoggedIn(true);
        } 
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    return (
        <>
        <div className="d-flex justify-content-center align-items-center" style={{ height: 100 + "vh" }}>
            <div className="container-sm mb-3" style={{maxWidth: 500 + "px"}}>
                <div className="card px-4 py-1">
                    <div className="card-body">
                        <h1 className="card-title">Login</h1>
                        
                        <form onSubmit={handleLogin}>

                            <label htmlFor="email" className="form-label" >E-Mail</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Update state on input change
                                className="form-control"
                                required
                            />
                            <label htmlFor="password" className="form-label">Passwort</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Update state on input change
                                className="form-control"
                                required
                            />
                            <br/>
                            <div classname="d-flex flex-row justify-content-between" style={{width: 100 + "%"}}>
                                <button id="submit" type="submit" className="btn btn-primary">Einloggen</button>
                                <button id="startPage" className="btn btn-outline-secondary" onClick = {() => navigate("/")}>Zur Startseite</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {loggedIn && <InfoToast message={"Eingeloggt!"}/>}
        </>
    )
}

export default Login;
