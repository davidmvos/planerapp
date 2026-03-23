
// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, child, get, onValue, remove, set, update } from "firebase/database";

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

export async function editTask(id, title, desc, due, category, user) {
    const taskId = id;

    const task = {
        "title": title,
        "task": desc,
        "due": due,
        "subject": category,
        "key": taskId
    }
    const taskRef = ref(db, "userdata/" + user.uid + "/tasks/" + taskId);
    return update(taskRef, task)
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
    return get(settingRef)
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

export async function getSubjects(user) {
    const defaultSubjects = {
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

    const settingRef = child(ref(db), "userdata/" + user.uid + "/preferences/subjects");
    return get(settingRef)
        .then((snapshot) => {
            if (snapshot.exists()) {

                if (snapshot.val() === null || snapshot.length === 0) {
                    setCategories(defaultSubjects, user);
                    return defaultSubjects;
                }
                return snapshot.val();

            }
            else {
                setCategories(defaultSubjects, user);
                return false;

            }

        })
        .catch((error) => {
            return { "success": false, "error": error };
        });
}

export function setCategories(subjectList, user) {
    const settingRef = ref(db, "userdata/" + user.uid + "/preferences/subjects");
    set(settingRef, subjectList)
        .then(() => {
            return { "success": true };
        })
        .catch((error) => {
            return { "success": false, "error": error };
        });
}

const default_timetable = {
    0: [2, 2, 4, 4],
    1: [7, 7, 5, 5],
    2: [8, 8, 3, 3],
    3: [20, 20, 14, 14],
    4: [12, 12, 16, 16]
}

export async function getTimetable(user) {
    const dataRef = ref(db, "userdata/" + user.uid + "/timetable/");
    return get(dataRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();

            }
            else {
                // setCategories(defaultSubjects, user);
                // keine Daten existieren
                return default_timetable;
                // return false;
            }

        })
        .catch((error) => {
            return { "success": false, "error": error };
        });
}

export function getLoggedIn() {
    return loggedIn;
}

