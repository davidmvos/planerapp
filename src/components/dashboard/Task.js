import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { editTask, setTaskDone } from "../../backend";
import "../../css/Dashboard.css";

import { getSubjects } from "../../backend";

import InfoToast from "../InfoToast";
import TaskCreationUi from "../TaskCreationUi";

function isoToNormal(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind 0-indexiert
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}

function getLocalTodayISODate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function Task({ id, name, desc, due, category }) {
    const auth = getAuth();

    const today = getLocalTodayISODate();
    
    const isNextDateEqual = (date1, date2) => new Date(date1.getTime() + 86400000).toDateString() === new Date(date2).toDateString();

    const [currentUser, setCurrentUser] = useState(null);

    const [taskCategoryPrettyName, setTaskCategoryPrettyName] = useState();

    const [subjects, setSubjects] = useState(null);

    const [toastMsg, setToastMsg] = useState(null);

    async function handleEditTask(taskName, taskDesc, taskDue, taskCategory, currentUser) {
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

    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                getSubjects(user).then(data => {
                    setTaskCategoryPrettyName(data[category.valueOf()]);
                });

            }
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    // TODO: Bearbeitung der Aufgabe mit dem NewTaskComponent regeln
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


            <TaskCreationUi callbackFn={handleEditTask} elementId={"editTaskModal-" + id} preFilled={{"taskName": name, "taskDesc": desc, "taskDue": due, "taskCategory": category.valueOf()}} />

            {toastMsg && <InfoToast message={toastMsg}/>}
        </>
    )

}