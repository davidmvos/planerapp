import { useState, useEffect } from 'react';
import {getSubjects, getTimetable} from "../backend";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { createNewTask } from '../backend';
import InfoToast from './InfoToast';
import Calendar from './Calendar';

import { Modal } from 'bootstrap';

export default function NewTask() {
    const auth = getAuth();
    const today = new Date().toISOString().split('T')[0];

    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskDue, setTaskDue] = useState(today);
    const [taskCategory, setTaskCategory] = useState("no");

    const [currentUser, setCurrentUser] = useState(null);

    const [newTaskCreated, setNewTaskCreated] = useState(false);
    const [taskCreationError, setTaskCreationError] = useState(false);

    const [subjects, setSubjects] = useState(null)
    const [timetable, setTimetable] = useState(null);

    function clearForm() {
        document.getElementById("taskName").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDue").value = today.toString();
        document.getElementById("taskCategory").value = 0;

        document.getElementById("taskName").classList.remove("is-invalid");
        document.getElementById("taskDescription").classList.remove("is-invalid");
        document.getElementById("taskDue").classList.remove("is-invalid");

        setTaskName("");
        setTaskDesc("");
        setTaskDue(today);
        setTaskCategory("no");
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                getSubjects(user).then(data => {setSubjects(data)});
                getTimetable(user).then(data => {setTimetable(data)});
                clearForm();
            }
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    async function handleNewTask() {
        if (currentUser) {

            
            if (taskName === "" || taskDesc === "" || taskDue === "") {


                if (taskName === "") document.getElementById("taskName").classList.add("is-invalid");
                if (taskDesc === "") document.getElementById("taskDescription").classList.add("is-invalid");
                if (taskDue === "") document.getElementById("taskDue").classList.add("is-invalid");

                // data-bs-target="#newTaskModal" data-bs-dismiss="modal"
            } else {
                const modalElement = document.getElementById("newTaskModal");
                const modal = Modal.getInstance(modalElement);
                modal.hide()
                const result = await createNewTask(taskName, taskDesc, taskDue, taskCategory, currentUser);
                if (result && result.success) {
                    setNewTaskCreated(true);
                    clearForm();
                } else {
                    let msg = <b className='text-danger'>Ein Fehler ist aufgetreten: {result.error.code}</b>;
                    setTaskCreationError(msg);
                    setTimeout(() => {setTaskCreationError(false)}, 3500);
                }
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
                                    <input type="text" className={"form-control"} id="taskName" onChange={(e) => {
                                        setTaskName(e.target.value);
                                        if (e.target.value === "") {
                                            e.target.classList.add("is-invalid");
                                        } else {
                                            e.target.classList.remove("is-invalid");
                                        }
                                        }} />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="taskDescription">Aufgabe</label>
                                    <textarea className={"form-control"} id="taskDescription" onChange={(e) => {
                                        setTaskDesc(e.target.value)
                                        if (e.target.value === "") {
                                            e.target.classList.add("is-invalid");
                                        } else {
                                            e.target.classList.remove("is-invalid");
                                        }
                                        }}></textarea>
                                </div>
                                <div className="mb-2">
                                    <Calendar
                                        value={taskDue}
                                        onChange={(value) => {
                                            setTaskDue(value);
                                        }}
                                        label="Enddatum"
                                        helperText="Wähle das Fälligkeitsdatum für die Aufgabe."
                                        timetable={timetable}
                                        subjects={subjects}
                                        selectedSubject={taskCategory}
                                        onSubjectChange={(value) => { setTaskCategory(value) }}
                                    />
                                    <input type="hidden" id="taskDue" value={taskDue} readOnly />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="taskCategory">Fach</label>
                                    <select 
                                    className="form-select" 
                                    id="taskCategory" 
                                    onChange={(e) => setTaskCategory(e.target.value)}
                                    value={taskCategory}
                                    >
                                        
                                        {subjects && Object.entries(subjects).map(([key, value]) => (
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
                            <button className="btn btn-primary" onClick={() => handleNewTask()}>Erstellen</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="newTaskCancelModal" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-danger-emphasis">Erstellung abbrechen?</h1>
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
            {taskCreationError && <InfoToast message={taskCreationError} />}
        </>
    )
}


