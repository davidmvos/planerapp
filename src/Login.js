import { useState, useEffect } from 'react';
import {checkLogin} from "./backend";
import { getAuth, onAuthStateChanged, reauthenticateWithCredential } from "firebase/auth";

import InfoToast from './InfoToast';


import { useNavigate } from 'react-router-dom';
import { EmailAuthProvider } from 'firebase/auth/web-extension';


const auth = getAuth();

function Login({inline, disableSignup, reLogin, callback}) {

    
    const navigate = useNavigate();
    const currentPath = window.location.pathname;

    // State to manage email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loggedIn, setLoggedIn] = useState(false);

    const[currentUser, setCurrentUser] = useState(null);

    const [toastError, setToastError] = useState(null);

    const [loginErrorState, setLoginErrorState] = useState("");



    const handleLogin = (event) => {
        event.preventDefault(); // Prevent default form submission

        if (reLogin && currentUser) {
            if (email === currentUser.email) {
                const credential = EmailAuthProvider.credential(email, password);
                reauthenticateWithCredential(currentUser, credential)
                .then(() => {
                    setLoggedIn(true);
                    if (callback) {
                        callback();
                    }
                })
                .catch((error) => {
                    let msg = <b className='text-danger'>{error.code}</b>; // TODO: Bessere Fehlernachrichten
                    setToastError(msg);
                    setTimeout(() => {setToastError(null)}, 4000)
                });
            } else {
                let msg = <b className='text-danger'>Falsche E-Mail-Addresse!</b>;
                setToastError(msg);
                setTimeout(() => {setToastError(null)}, 4000)
            }

        } else {
            checkLogin(email, password)
            .then((data) => {
                if (!data.success) {
                    if (data.error.code === "auth/invalid-email" || data.error.code === "auth/user-not-found" || data.error.code ==="auth/invalid-password" || data.error.code === "auth/invalid-credential") {
                        setLoginErrorState("is-invalid");
                        let msg = <b className='text-danger'>Falsche Zugangsdaten!</b>;
                        if (data.error.code === "auth/user-not-found") {
                            msg = <b className='text-danger'>Account wurde nicht gefunden</b>;
                        }


                        setToastError(msg);
                        setTimeout(() => {setToastError(null)}, 4000);
                        setTimeout(() => {setLoginErrorState("")}, 3050);
                    }
                } else {
                    setLoginErrorState("");
                }
            });
        }
        
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {

            if (!reLogin) {
                setLoggedIn(true);
            }
            

            setCurrentUser(user);

            if (currentPath === "/login") {
                navigate("/");
            }
            
        } 
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    return (
        <>
        <div className={inline? "d-inline" : "d-flex justify-content-md-center align-items-sm-center"} style={{ height: inline? "" : "100vh" }}>
            <div className={inline? "container d-block" : "container-sm mb-3"} style={{maxWidth: 500 + "px", marginTop: inline? "" : "10px"}}>
                <div className={inline? "card px-0 py-0 mb-3" : "card px-4 py-1"} style={{border: inline? "none" : ""}}>
                    <div className="card-body" style={{paddingTop: inline? "8px" : ""}}>
                        <h1 className="card-title mb-3">Login</h1>
                        <form onSubmit={handleLogin}>
                            <div className='mb-3'>
                                <label htmlFor="email" className="form-label" >E-Mail</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Update state on input change
                                    className={"form-control " + loginErrorState }
                                    required
                                    autoComplete="true"
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="password" className="form-label">Passwort</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} // Update state on input change
                                    className={"form-control " + loginErrorState }
                                    required
                                    autoComplete="true"
                                />
                            </div>
                            <br/>
                            <div className={`d-flex flex-row w-100 ${disableSignup? "justify-content-end" : "justify-content-space-between"}`} 
                                style={{width: 100 + "%", display: "flex", justifyContent: disableSignup? "end" : "space-between"}}>
                                <button id="submit" type="submit" className="btn btn-primary">Einloggen</button>
                                
                                {disableSignup? "" : <button id="startPage" className="btn btn-primary" onClick = {() => navigate("/signup")}>Account erstellen</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {loggedIn && <InfoToast message={"Eingeloggt!"}/>}
        {toastError && <InfoToast message={toastError} />}
        </>
    )
}

export default Login;
