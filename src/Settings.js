
import { useState, useEffect } from "react";
import Navbar from "./Navbar"
import NewTask from "./NewTask"

import "./Settings.css";
import { getAuth, onAuthStateChanged, updateEmail, updatePassword, validatePassword } from "firebase/auth";

import { Modal } from 'bootstrap';


import { getSubjects } from "./backend";
import InfoToast from "./InfoToast";
import Login from "./Login";

import EmptyOptionMenu from "./EmptyOptionMenu";

const auth = getAuth();
auth.languageCode = "de";

export default function Settings() {
    const [currentUser, setCurrentUser] = useState(null);
    const [subjects, setSubjects] = useState(null)

    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');

    const [toastMsg, setToastMsg] = useState(null);

    const [showLoginMask, setShowLoginMask] = useState(false);

    const [emailInvalid, setEmailInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState("");
    
    function onPasswordChange(e) {
        setPassword(e.target.value);

        if (e.target.value !== "") {
            validatePassword(getAuth(), e.target.value)
            .then((status) => {
                if (status.isValid) {
                    setPasswordInvalid("is-valid");
                } else if (!status.isValid) {
                    setPasswordInvalid("is-invalid");
                }
            })
        }
    }


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
                // setToastMsg(msg);
                setTimeout(() => {setToastMsg(null)}, 4000);
            } 
            else {
                let msg = <b className="text-danger">Fehler: {error.code}</b>;
                if (error.code === "auth/weak-password") {
                    msg = "";
                    setPasswordInvalid("is-invalid");
                }
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
                // setToastMsg(msg);
                setTimeout(() => {setToastMsg(null)}, 4000);
            } 
            else {
                setEmailInvalid(true);
                setTimeout(() => setEmailInvalid(false), 3000);
                let msg = <b className="text-danger">Fehler: {error.code}</b>;
                if (error.code === "auth/invalid-email") {
                    msg = <b className="text-danger">Fehlerhafte E-Mail-Addresse!</b>;
                    msg = "";
                }
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
        <Navbar optionMenu={<EmptyOptionMenu />} />
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
                        <input autoComplete="email" type="email" id="newEmail" name="newEmail" className={`form-control ${emailInvalid? "is-invalid" : ""}`} placeholder="Neue E-Mail" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <input type="submit" className="btn btn-primary" value="Speichern" onClick={(e) => {handleEmailChange(e);}}/>
                        <div className="invalid-feedback">Ungültige E-Mail-Addresse!</div>
                    </div>
                    
                </form>
                <form className="mb-3">
                    <h3 className="fs-5">Passwort</h3>
                    <div className="input-group input-group-auto-width">
                            <input autoComplete="new-password" type="password" id="newPassword" name="newPassword" className={`form-control ${passwordInvalid}`} placeholder="Neues Passwort" value={password} onChange={(e) => onPasswordChange(e)}></input>
                        <input type="submit" className="btn btn-primary" value="Speichern" onClick={(e) => {handlePasswordChange(e);}}/>
                            <div className="invalid-feedback">Passwort zu schwach!</div>
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