import { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';


export default function SignOutButton() {
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);

    function handleLogout() {
        if (currentUser) {
            signOut(auth);
        }
    }

    useEffect(() => {
        

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);


    return (
        <>
        <button className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#signOutModal">
            Logout
        </button>

        <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="signOutModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5 text-danger">Ausloggen?</h1>
                    </div>
                    <div className="modal-body">
                        Du wirst auf diesem Gerät ausgeloggt und musst dich neu anmelden. Deine Daten bleiben gespeichert.
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-outline-secondary" data-bs-dismiss="modal" data-bs-target="#signOutModal">Zurück</button>
                        {currentUser && <button className="btn btn-danger" data-bs-dismiss="modal" onClick={handleLogout} data-bs-target="#signOutModal">Ausloggen</button>}
                    </div>
                </div>
            </div>
        </div>
        
        </>


    )

}