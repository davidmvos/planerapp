import React, { useState, useEffect } from 'react';
import {checkLogin} from "./backend";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "bootstrap/dist/css/bootstrap.min.css";

import { createNewTask } from './backend';
import InfoToast from './InfoToast';

export default function NewTask() {
    const auth = getAuth();
    const today = new Date().toISOString().split('T')[0];

    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskDue, setTaskDue] = useState(today);
    const [taskCategory, setTaskCategory] = useState("no");

    const [currentUser, setCurrentUser] = useState(null);

    const [newTaskCreated, setNewTaskCreated] = useState(false);

    const categories = {
        0: "Ohne Kategorie",
        1: "Biologie",
        2: "Bio-Chemie",
        3: "Bio-Sport",
        4: "Bionik",
        5: "Chemie",
        6: "Deutsch",
        7: "Englisch",
        8: "Erziehungswissenschaften",
        9: "Französich",
        10: "Geografie",
        11: "Geschichte",
        12: "Informatik",
        13: "Italienisch",
        14: "Kunst",
        15: "Latein",
        16: "Mathe",
        17: "Musik",
        18: "Philosophie",
        19: "Physik",
        20: "Politik",
        21: "Politik-Wirtschaft",
        22: "Religion",
        23: "Sozialwissenschaften",
        24: "Spanisch",
        25: "Yourope",
        26: "Sport"
    };

    function clearForm() {
        document.getElementById("taskName").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDue").value = today;
        document.getElementById("taskCategory").value = "no";

        setTaskName("");
        setTaskDesc("");
        setTaskDue("");
        setTaskCategory("no");
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    async function handleNewTask() {
        if (currentUser) {
            const result = await createNewTask(taskName, taskDesc, taskDue, taskCategory, currentUser);
            if (result && result.success) {
                setNewTaskCreated(true);
                clearForm();
            }
        }
        
    }
    return (
        <>
            <div className="modal fade" id="newTaskModal" tabIndex={-1} data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen-md-down">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Neue Aufgabe</h1>
                            {/* <button type="button" className="btn-close btn-danger" data-bs-dismiss="modal" data-bs-target="#newTaskModal" aria-label="Abbrechen"></button> */}
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="taskName">Überschrift</label>
                                    <input type="text" className="form-control" id="taskName" onChange={(e) => setTaskName(e.target.value)} />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="taskDescription">Aufgabe</label>
                                    <textarea className="form-control" id="taskDescription" onChange={(e) => setTaskDesc(e.target.value)}></textarea>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="taskDue">Enddatum</label>
                                    <input type="date" className="form-control" id="taskDue" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="taskCategory">Fach</label>
                                    <select 
                                    className="form-select" 
                                    id="taskCategory" 
                                    onChange={(e) => setTaskCategory(e.target.value)}>
                                        
                                        {Object.entries(categories).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}

                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-danger" data-bs-target="#newTaskCancelModal" data-bs-toggle="modal">Abbrechen</button>
                            <button className="btn btn-primary" data-bs-target="#newTaskModal" data-bs-dismiss="modal" onClick={() => handleNewTask()}>Erstellen</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="newTaskCancelModal" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-danger">Achtung</h1>
                        </div>
                        <div className="modal-body">
                            Es können nicht gespeicherte Daten verloren gehen
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-secondary" data-bs-target="#newTaskModal" data-bs-toggle="modal">Zurück</button>
                            <button className="btn btn-danger" data-bs-target="#newTaskCancelModal" data-bs-dismiss="modal" onClick={() => clearForm()}>Erstellung abbrechen</button>
                        </div>
                    </div>
                </div>
            </div>
            {newTaskCreated && <InfoToast message={"Neue Aufgabe erstellt"} />}
        </>
    )
}


