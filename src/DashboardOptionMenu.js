import { useState, useEffect } from 'react';
import {getSortingMode, setSortingMode} from "./backend";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import InfoToast from './InfoToast';

import "bootstrap/dist/css/bootstrap.min.css";


const auth = getAuth();

export default function DashboardOptionMenu() {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentSortingMode, setCurrentSortingMode] = useState(null);
    const [currentModeActive, setCurrentModeActive] = useState([false, false, false, false, false]);
    const [showToast, setShowToast] = useState(false);

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

    function handleSortingModeChange(mode) {
        setSortingMode(mode, currentUser);
        setCurrentSortingMode(mode);
        setShowToast(true);
        setTimeout(() => { setShowToast(false) }, 2000);
    }

    function activeForSortingMode(mode) {
        if (mode == currentSortingMode) {
            return "active";
        } else {
            return "";
        }
    }
    return (
        <>
        <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#newTaskModal">Neue Aufgabe</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><h6 className="dropdown-header">Sortierung</h6></li>
            <li><a onClick={() => handleSortingModeChange(0)} className={"dropdown-item " + activeForSortingMode(0)} href="#">Standard</a></li>
            <li><a onClick={() => handleSortingModeChange(1)} className={"dropdown-item " + activeForSortingMode(1)} href="#">Enddatum aufsteigend</a></li>
            <li><a onClick={() => handleSortingModeChange(2)} className={"dropdown-item " + activeForSortingMode(2)} href="#">Enddatum absteigend</a></li>
            <li><a onClick={() => handleSortingModeChange(3)} className={"dropdown-item " + activeForSortingMode(3)} href="#">Fach</a></li>
        </ul>
        {showToast && <InfoToast message={"Sortiermodus geändert!"}/>}
        </>
    )
}