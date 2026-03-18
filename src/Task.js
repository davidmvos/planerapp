import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { editTask, setTaskDone } from "./backend";
import "./Dashboard.css";

import { getSubjects } from "./backend";

import InfoToast from "./InfoToast";

function isoToNormal(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind 0-indexiert
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}

export default function Task({ id, name, desc, due, category }) {
    const auth = getAuth();

    const today = new Date().toISOString().split('T')[0];
    
    const isNextDateEqual = (date1, date2) => new Date(date1.getTime() + 86400000).toDateString() === new Date(date2).toDateString();

    const [currentUser, setCurrentUser] = useState(null);

    const [taskName, setTaskName] = useState(name);
    const [taskDesc, setTaskDesc] = useState(desc);
    const [taskDue, setTaskDue] = useState(due);
    const [taskCategory, setTaskCategory] = useState(category);

    const [taskCategoryPrettyName, setTaskCategoryPrettyName] = useState();

    const [subjects, setSubjects] = useState(null);

    const [toastMsg, setToastMsg] = useState(null);

    async function handleEditTask() {
        editTask(id, taskName, taskDesc, taskDue, taskCategory, currentUser)
        .then((data) => {
            setToastMsg("Änderung gespeichert!");

            setTimeout(() => {setToastMsg(null)}, 4000);
        })
        .catch((error) => {
            let msg = <b className="text-danger">Fehler: {error.code}</b>;
            setToastMsg(msg);
            setTimeout(() => {setToastMsg(null)}, 4000);
        });
    }

    function resetForm() {
        document.getElementById("taskName-"+ id).value = name;
        document.getElementById("taskDescription-"+ id).value = desc;
        document.getElementById("taskDue-"+ id).value = due;
        document.getElementById("taskCategory-"+ id).value = category;

        setTaskName(name);
        setTaskDesc(desc);
        setTaskDue(due);
        setTaskCategory(category);
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                getSubjects(user).then(data => {
                    setSubjects(data);                    
                    setTaskCategoryPrettyName(data[category.valueOf()]);
                
                });

            }
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    return (
        <>
            <div className={`card mx-sm-0 mx-sm-2 my-2 col-sm-3 p-0 task-card  ${due<today? "bg-danger-subtle text-dark" : ""} ${due<today? "border-danger" : ""} ${due===today? "border-warning" : ""} ${isNextDateEqual(new Date(today), new Date(due))? "border-warning" : ""} `} id={id} style={{ minWidth: 300 + "px" }}>
                <div className="card-header">
                    {taskCategoryPrettyName && taskCategoryPrettyName}
                </div>
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className={`card-text ${due<today? "text-danger" : ""} ${due===today? "text-warning" : "text-secondary"}`}>Bis zum {isoToNormal(due)}</p>
                    <p className="card-text">{desc}</p>
                </div>
                <div className={`card-footer`}>
                    <button className={`btn btn-outline-primary me-2`} data-bs-target={"#editTaskModal-" + id} data-bs-toggle="modal">Bearbeiten</button>
                    <button className={`btn  ${due<today? "btn-outline-warning" : "btn-outline-secondary"}`} data-bs-target={"#" + id + "-delete"} data-bs-toggle="modal">Erledigt</button>
                </div>
            </div>


            <div className="modal fade" id={id + "-delete"} tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-danger-emphasis">Als erledigt markieren?</h1>
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


            <div className="modal fade" id={"editTaskModal-" + id} tabIndex={-1} data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen-md-down">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Neue Aufgabe</h1>
                            {/* <button type="button" className="btn-close btn-danger" data-bs-dismiss="modal" data-bs-target="#newTaskModal" aria-label="Abbrechen"></button> */}
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor={"taskName-"+ id}>Überschrift</label>
                                    <input type="text" className="form-control" id={"taskName-"+ id} value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor={"taskDescription-"+ id}>Aufgabe</label>
                                    <textarea className="form-control" id={"taskDescription-"+ id} value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)}></textarea>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor={"taskDue-"+ id}>Enddatum</label>
                                    <input type="date" className="form-control" id={"taskDue-"+ id} value={taskDue} onChange={(e) => setTaskDue(e.target.value)} />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor={"taskCategory-"+ id}>Fach</label>
                                    <select 
                                    className="form-select" 
                                    id={"taskCategory-"+ id} 
                                    onChange={(e) => setTaskCategory(e.target.value)}>
                                        
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
                            <button className="btn btn-outline-danger" data-bs-target={"#editTaskCancelModal-" + id} data-bs-toggle="modal">Abbrechen</button>
                            <button className="btn btn-primary" data-bs-target={"#editTaskModal-" + id} data-bs-dismiss="modal" onClick={() => handleEditTask()}>Speichern</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id={"editTaskCancelModal-" + id} data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-danger-emphasis">Änderungen verwerfen?</h1>
                        </div>
                        <div className="modal-body">
                            Es können nicht gespeicherte Daten verloren gehen
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-secondary" data-bs-target={"#editTaskModal-" + id} data-bs-toggle="modal">Zurück</button>
                            <button className="btn btn-danger" data-bs-target={"#editTaskCancelModal-" + id} data-bs-dismiss="modal" onClick={resetForm} >Verwerfen</button>
                        </div>
                    </div>
                </div>
            </div>

            {toastMsg && <InfoToast message={toastMsg}/>}
        </>
    )

}