import React, { useState, useEffect } from 'react';
import {checkLogin, getSortingMode, setSortingMode} from "./backend";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import InfoToast from './InfoToast';

import bootstrap from 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from 'react-router-dom';

import SignOutButton from './SignOutButton';

const auth = getAuth();

export default function Navbar() {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentSortingMode, setCurrentSortingMode] = useState(null);
    const [currentModeActive, setCurrentModeActive] = useState([false, false, false, false, false]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);

                getSortingMode(user).then((data) => {
                    if (data) {
                        if (data.success) {
                            setCurrentSortingMode(data["mode"]);
                            

                        } else {
                            setCurrentSortingMode(0);
                        }
                    }
                });
            }
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">

                <a className="navbar-brand" href="#">Navbar</a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Optionen
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#newTaskModal">Neue Aufgabe</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><h6 class="dropdown-header">Sortierung</h6></li>
                            <li><a onClick={() => setSortingMode(0, currentUser)} className={"dropdown-item " + ""} href="#">Standard</a></li>
                            <li><a onClick={() => setSortingMode(1, currentUser)} className={"dropdown-item " + ""} href="#">Enddatum aufsteigend</a></li>
                            <li><a onClick={() => setSortingMode(2, currentUser)} className={"dropdown-item " + ""} href="#">Enddatum absteigend</a></li>
                            <li><a onClick={() => setSortingMode(3, currentUser)} className={"dropdown-item " + ""} href="#">Fach</a></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" aria-disabled="true">Stundenplan</a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link" href="#">Einstellungen</a>
                    </li>
                </ul>
                <div class="d-flex">
                    <SignOutButton />
                </div>
            
                </div>
            </div>
        </nav>
    )
}
