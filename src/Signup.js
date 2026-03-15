import { useState, useEffect } from 'react';
import {checkLogin} from "./backend";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";

import InfoToast from './InfoToast';

import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from 'react-router-dom';



export default function Signup() {
    const auth = getAuth();
    auth.languageCode = "de";
    const navigate = useNavigate();

    // State to manage email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [currentUser, setCurrentUser] = useState(null);

    const [privacyConsent, setPrivacyConsent] = useState(false);

    const [loginError, setLoginError] = useState(null);

    const [passwordValid, setPasswordValid] = useState(false);

    

    const [loggedIn, setLoggedIn] = useState(false);


    const handleSignup = (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log(checkLogin(email, password));
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed up 
            setCurrentUser(userCredential.user);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // alert(errorMessage + "Code " + errorCode);
            setLoginError(errorMessage);
        });

        setTimeout(() => {setLoginError(null);}, 5000);
    };

    function checkPasswords() {
        // validatePassword(auth, password).then((valid) => {setPasswordValid(valid && password === passwordRepeat)}); // FIXME: Passwort-Validierung ermöglichen
        return
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setLoggedIn(true);
            navigate("/");
        } 
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth, navigate]);
    let toastMsg;
    if (loginError) {
        toastMsg = <b className='text-danger'>{loginError}</b>;
    }
    

    return (
        <>
        <div className="d-flex justify-content-md-center align-items-sm-center" style={{ height: 100 + "vh" }}>
            <div className="container-sm mb-3" style={{maxWidth: 500 + "px", marginTop: 10 + "px"}}>
                <div className="card px-4 py-1">
                    <div className="card-body">
                        <h1 className="card-title mb-3">Account erstellen</h1>
                        
                        <form onSubmit={handleSignup}>

                            <div className="mb-3">
                                <label htmlFor="signupEmail" className="form-label" >E-Mail</label>
                                <input
                                    type="text"
                                    id="signupEmail"
                                    name="signupEmail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Update state on input change
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="signupPassword" className="form-label">Passwort</label>
                                <input
                                    type="password"
                                    id="signupPassword"
                                    name="signupPassword"
                                    value={password}
                                    onChange={(e) => {setPassword(e.target.value); checkPasswords();}} // Update state on input change
                                    className={`form-control ${password === passwordRepeat ? "" : "is-invalid"}`}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="passwordRepeat" className="form-label">Passwort wiederholen</label>
                                <input
                                    type="password"
                                    id="passwordRepeat"
                                    name="passwordRepeat"
                                    value={passwordRepeat}
                                    onChange={(e) => {setPasswordRepeat(e.target.value); checkPasswords();}} // Update state on input change
                                    className={`form-control ${password === passwordRepeat ? "" : "is-invalid"} ${passwordValid ? "is-valid" : ""}`}
                                    required
                                />
                            </div>

                            <div className='form-check'>
                                <input
                                        type='checkbox'
                                        checked={privacyConsent}
                                        id="privacy-consent"
                                        className='form-check-input'
                                        onChange={(e) => setPrivacyConsent(e.target.checked)} // Inline handler
                                /> 
                                <label for="privacy-consent" className='form-check-label'>
                                    Ich bin mit der Verarbeitung meiner Daten einverstanden
                                </label>
                            </div>
                            <br/>
                            <div classname="d-flex flex-row justify-content-evenly w-100" style={{width: 100 + "%", display: "flex", justifyContent: "space-between"}}>
                                <button id="submit" type="submit" className={`btn btn-primary ${!privacyConsent ? "disabled" : "" }`}>Account erstellen</button>
                                <button id="loginPage" className="btn btn-outline-secondary" onClick = {() => navigate("/login")}>Zurück</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {loggedIn && <InfoToast message={"Eingeloggt!"}/>}
        {loginError && <InfoToast message={toastMsg} />}
        </>
    )
}