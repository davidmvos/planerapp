import { useState, useEffect } from 'react';
import {getSubjects, getTimetable} from "../backend";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { createNewTask } from '../backend';
import InfoToast from './InfoToast';
import Calendar from './Calendar';

import { Modal } from 'bootstrap';
import TaskCreationUi from './TaskCreationUi';

export default function NewTask() {
    const auth = getAuth();
    const today = new Date().toISOString().split('T')[0];

    const [currentUser, setCurrentUser] = useState(null);

    const [newTaskCreated, setNewTaskCreated] = useState(false);
    const [taskCreationError, setTaskCreationError] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    async function handleNewTask(taskName, taskDesc, taskDue, taskCategory, currentUser) {
        if (currentUser) {

            const modalElement = document.getElementById("newTaskModal");
            const modal = Modal.getInstance(modalElement);
            modal.hide()
            const result = await createNewTask(taskName, taskDesc, taskDue, taskCategory, currentUser);
            if (result && result.success) {
                setNewTaskCreated(true);
            } else {
                let msg = <b className='text-danger'>Ein Fehler ist aufgetreten: {result.error.code}</b>;
                setTaskCreationError(msg);
                setTimeout(() => {setTaskCreationError(false)}, 3500);
            }
            
        }
        
    }
    return (
        <>
            <TaskCreationUi callbackFn={handleNewTask} />
            {newTaskCreated && <InfoToast message={"Neue Aufgabe erstellt"} />}
            {taskCreationError && <InfoToast message={taskCreationError} />}
        </>
    )
}


