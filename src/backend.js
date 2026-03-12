
// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, child, get, onValue, remove, set } from "firebase/database";

import firebase from 'firebase/compat/app';
import { useState } from 'react';

import app from './env';


// Initialize Firebase
//const app = initializeApp(firebaseConfig);


const analytics = getAnalytics(app);
const auth = getAuth(app); // Correctly getting the auth instance
const db = getDatabase(app);


var loggedIn = false;
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        loggedIn = true;
    } else {
    }
});

setPersistence(auth, browserLocalPersistence);

function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


export function checkLogin(email, password) {
    return signInWithEmailAndPassword(auth, email, password) // Corrected call
        .then((userCredentials) => {
            return { success: true, userCredentials }; // Use an object for return
        })
        .catch((error) => {
            return { success: false, error }; // Use an object for return
        });

}

export async function createNewTask(title, desc, due, category, user) {
    const today = new Date().toISOString().split('T')[0];
    const taskId = createRandomString(12);

    const task = {
        "title": title,
        "task": desc,
        "due": due,
        "subject": category,
        "done": false,
        "created": today,
        "key": taskId
    }
    const taskRef = ref(db, "userdata/" + user.uid + "/tasks/" + taskId);
    return set(taskRef, task)
        .then(() => {
            return { "success": true };
        })
        .catch((error) => {
            return { "success": false, "error": error };
        });
}

export async function removeTask(taskId, user) {
    const taskRef = ref(db, "userdata/" + user.uid + "/tasks/" + taskId);
    remove(taskRef)
        .then(() => {
            return { "success": true };
        })
        .catch((error) => {
            return { "success": false, "error": error };
        });
}

export async function setTaskDone(taskId, user) {
    const taskRef = ref(db, "userdata/" + user.uid + "/tasks/" + taskId + "/done");
    set(taskRef, true)
        .then(() => {
            return { "success": true };
        })
        .catch((error) => {
            return { "success": false, "error": error };
        });
}


export async function setSortingMode(newMode, user) {
    const settingRef = ref(db, "userdata/" + user.uid + "/preferences/sortingMode");
    set(settingRef, newMode)
        .then(() => {
            return { "success": true };
        })
        .catch((error) => {
            return { "success": false, "error": error };
        });
}

export async function getSortingMode(user) {
    const settingRef = child(ref(db), "userdata/" + user.uid + "/preferences/sortingMode");
    get(settingRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                return { "success": true, "mode": snapshot.val() };
            }
            else {
                return { "success": false, "error": "Snapshot doesnt exist" };
            }
            
        })
        .catch((error) => {
            return { "success": false, "error": error };
        });
}

export function getLoggedIn() {
    return loggedIn;
}

