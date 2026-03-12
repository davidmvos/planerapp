import logo from './logo.svg';
import './App.css';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { useEffect, useState } from 'react';
import { getDatabase, ref, child, get, onValue } from "firebase/database";

import "./Dashboard.css";

import bootstrap from 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

import InfoToast from './InfoToast';
import Navbar from './Navbar';
import NewTask from './NewTask';
import Task from './Task';



const auth = getAuth();


function Dashboard() {

    const [email, setEmail] = useState(null);
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [sortingMode, setSortingMode] = useState(null);

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

    // Compute sorted tasks from the raw tasks object + sortingMode
    function getSortedTasks() {
        if (!tasks) return [];
        const entries = Object.entries(tasks).filter(([, value]) => !value.done);

        if (sortingMode == 1 || sortingMode == 2) { // modus 2: Aufsteigend nach Enddatum, modus 3: absteigend
            entries.sort(([, taskA], [, taskB]) => {
                return (taskA.due || "").localeCompare(taskB.due || "");
            });

            if (sortingMode == 2) {
                entries.reverse();
            }
        } 
        if (sortingMode == 3) { // nach fach
            entries.sort(([, taskA], [, taskB]) => {
                return (taskA.subject || "").localeCompare(taskB.subject || "");
            });
        }


        return entries;
    }

    useEffect(() => {
        let unsubTasks = null;
        let unsubSorting = null;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Clean up previous onValue listeners when auth state changes
            if (unsubTasks) { unsubTasks(); unsubTasks = null; }
            if (unsubSorting) { unsubSorting(); unsubSorting = null; }

            if (user) {
                setEmail(user.email);
                setUser(user);

                const dbRef = ref(getDatabase());
                get(child(dbRef, `userdata/${user.uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        setTasks(snapshot.val().tasks);
                        setSortingMode(snapshot.val().preferences?.sortingMode);
                    } else {
                        setTasks({});
                    }
                }).catch((error) => {
                    console.error(error);
                });

                const taskPollingRef = ref(getDatabase(), `userdata/${user.uid}/tasks/`);

                unsubTasks = onValue(taskPollingRef, (snapshot) => {
                    const data = snapshot.val();
                    setTasks(data);
                });

                const sortingPollingRef = ref(getDatabase(), `userdata/${user.uid}/preferences/sortingMode`);

                unsubSorting = onValue(sortingPollingRef, (snapshot) => {
                    const newMode = snapshot.val();
                    setSortingMode(newMode);
                });

            } else {
                setEmail(null);
                setUser(null);
                setTasks(null);
            }
        });

        return () => {
            // Clean up all listeners on unmount
            unsubscribe();
            if (unsubTasks) unsubTasks();
            if (unsubSorting) unsubSorting();
        };
    }, [auth]);



    if (email === null ) {
        return <p>Lade...</p>;
    }



    const sortedTasks = getSortedTasks();

    return (
    <>
    <Navbar/>
    <NewTask/>
    <div className="container-xxl my-3 d-flex flex-row flex-wrap" data-masonry='{"percentPosition": true, "columnWidth": 200, "itemSelector": ".grid-item"}'>
        {
            sortedTasks.map(([key, value]) => (
                <Task key={key} name={value.title} id={key} due={value.due} category={categories[value.subject.valueOf()]} desc={value.task} />
            ))
        }
    
    </div>

    {email && <InfoToast message={`Eingeloggt als ${email}`}/>}
    </>
    );
}

export default Dashboard;
