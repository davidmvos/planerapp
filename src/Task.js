import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { removeTask, setTaskDone } from "./backend";
import "./Dashboard.css";

import bootstrap from 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";



export default function Task({ id, name, desc, due, category }) {
    const auth = getAuth();

    const [currentUser, setCurrentUser] = useState(null);

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
            <div className="card mx-sm-0 mx-sm-2 my-2 col-sm-3 p-0 task-card" id={id} style={{ minWidth: 300 + "px" }}>
                <div className="card-header">
                    {category}
                </div>
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{due}</p>
                    <p className="card-text">{desc}</p>
                </div>
                <div className="card-footer">
                    <button className="btn btn-outline-secondary" data-bs-target={"#" + id + "-delete"} data-bs-toggle="modal">Erledigt</button>
                </div>
            </div>
            <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id={id + "-delete"}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-danger">Achtung</h1>
                        </div>
                        <div className="modal-body">
                            Aufgabe wird als erledigt markiert
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-secondary" data-bs-dismiss="modal" data-bs-target={"#" + id + "-delete"}>Zurück</button>
                            {currentUser && <button className="btn btn-warning" data-bs-dismiss="modal" onClick={() => setTaskDone(id, currentUser)} data-bs-target={"#" + id + "-delete"}>Als erledigt markieren</button>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}