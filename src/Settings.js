
import { useState, useEffect } from "react";
import Navbar from "./Navbar"
import NewTask from "./NewTask"

import "./Settings.css";
import { getAuth, onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";

import { Modal } from 'bootstrap';


import { getSubjects } from "./backend";
import InfoToast from "./InfoToast";
import Login from "./Login";

const auth = getAuth();
auth.languageCode = "de";

export default function Settings() {
    const [currentUser, setCurrentUser] = useState(null);
    const [subjects, setSubjects] = useState(null)

    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');

    const [toastMsg, setToastMsg] = useState(null);

    const [showLoginMask, setShowLoginMask] = useState(false);
    


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                getSubjects(user).then(data => {setSubjects(data)});
            }
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    function handlePasswordChange(event) {
        event.preventDefault();
        updatePassword(auth.currentUser, password).then(() => {
            setToastMsg("Passwort geändert!");
            setTimeout(() => {setToastMsg(null)}, 4000);
        }).catch((error) => {
            if (error.code === "auth/requires-recent-login") {
                let targetModal = new Modal(document.getElementById("loginModal"));
                targetModal.show();
                let msg = <b className="text-danger">Bitte aktuelle Zugangsdaten bestätgen!</b>;
                setToastMsg(msg);
                setTimeout(() => {setToastMsg(null)}, 4000);
            } 
            else {
                let msg = <b className="text-danger">{error.message}</b>;
                setToastMsg(msg);
                setTimeout(() => {setToastMsg(null)}, 4000);
            }

        });
    }
    function handleEmailChange(event) {
        event.preventDefault();
        updateEmail(auth.currentUser, email).then(() => {
            setToastMsg("E-Mail geändert!");
            setTimeout(() => {setToastMsg(null)}, 4000);
        }).catch((error) => {
            if (error.code === "auth/requires-recent-login") {
                let targetModal = new Modal(document.getElementById("loginModal"));
                targetModal.show();
                let msg = <b className="text-danger">Bitte aktuelle Zugangsdaten bestätgen!</b>;
                setToastMsg(msg);
                setTimeout(() => {setToastMsg(null)}, 4000);
            } 
            else {
                let msg = <b className="text-danger">{error.message}</b>;
                setToastMsg(msg);
                setTimeout(() => {setToastMsg(null)}, 4000);
            }


        });
    }

    function handleRelogin() {
        console.log("hide");
        let targetModal = document.getElementById("loginModal");
        targetModal = Modal.getInstance(targetModal);
        if (targetModal) {
            targetModal.hide();
            setToastMsg("Login bestätigt, bitte neue Einstellungen erneut speichern!");
            setTimeout(() => {setToastMsg(null)}, 5000);
        }
        
    }
    return (

        <>
        <Navbar optionMenu={<ul className="dropdown-menu"><li><a className="dropdown-item" href="." data-bs-toggle="modal" data-bs-target="#newTaskModal">Neue Aufgabe</a></li></ul>} />
        <NewTask />
        <div className="container mt-3">
            <h1>Einstellungen</h1>
            <p>Hier können diverse Einstellungen getätigt werden</p>
            <hr />
            <div className="mb-3">
                <h2 className="mb-3">Info</h2>
                <p>Eingeloggt als {currentUser && currentUser.email}</p>
            </div>
            <div>
                <h2 className="mb-3">Account</h2>
                <form className="mb-3">
                    <h3 className="fs-5">E-Mail</h3>
                    <div className="input-group input-group-auto-width">
                        <input autoComplete="false" type="text" id="newEmail" name="newEmail" className="form-control" placeholder="Neue E-Mail" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <input type="submit" className="btn btn-primary" value="Speichern" onClick={(e) => {handleEmailChange(e);}}/>
                    </div>
                    
                </form>
                <form className="mb-3">
                    <h3 className="fs-5">Passwort</h3>
                    <div className="input-group input-group-auto-width">
                        <input autoComplete="false" type="password" id="newPassword" name="newPassword" className="form-control" placeholder="Neues Passwort" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <input type="submit" className="btn btn-primary" value="Speichern" onClick={(e) => {handlePasswordChange(e);}}/>
                    </div>
                </form>
            </div>
            {/*<div>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">Öffnen</button>
                <button className="btn btn-info" onClick={() => {
                    let targetModal = new Modal(document.getElementById("loginModal"));
                    targetModal.show();
                }}>Öffnen 2</button>
            </div>*/}
        </div>

        <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" id="loginModal">
            <div className="modal-dialog modal-dialog-centered modal-fullscreen-md-down">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Bitte erneut anmelden</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{margin: 0 + "px", padding: 0 + "px"}}>
                        <Login inline={true} disableSignup={true} reLogin={true} callback={handleRelogin}/>
                    </div>
                    {/*<div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button>
                        <button type="button" className="btn btn-primary">Einloggen</button>
                    </div>*/}
                </div>
            </div>
        </div>

        
        {toastMsg && <InfoToast message={toastMsg} />}
        </>
    )
}