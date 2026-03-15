import logo from './logo.svg';
import './App.css';
import { getAuth,  onAuthStateChanged} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import DashboardOptionMenu from './DashboardOptionMenu';

import "./Dashboard.css";

import bootstrap, { Toast } from 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

import InfoToast from './InfoToast';
import Navbar from './Navbar';
import NewTask from './NewTask';
import Task from './Task';
import SignOutButton from './SignOutButton';
import { getSubjects } from './backend';






function Dashboard() {
    const auth = getAuth();

    const [email, setEmail] = useState(null);
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [sortingMode, setSortingMode] = useState(null);

    const navigate = useNavigate();

    const [subjects, setSubjects] = useState(null);
    

    // Compute sorted tasks from the raw tasks object + sortingMode
    function getSortedTasks() {
        if (!tasks) return [];
        const entries = Object.entries(tasks).filter(([, value]) => !value.done);

        if (sortingMode === 1 || sortingMode === 2) { // modus 2: Aufsteigend nach Enddatum, modus 3: absteigend
            entries.sort(([, taskA], [, taskB]) => {
                return (taskA.due || "").localeCompare(taskB.due || "");
            });

            if (sortingMode === 2) {
                entries.reverse();
            }
        } 
        if (sortingMode === 3) { // nach fach
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

                getSubjects(user).then(data => {
                    setSubjects(data);
                });
                

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
                navigate("/login");
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
    <Navbar optionMenu={<DashboardOptionMenu />}/>
    <NewTask/>
    <div className="container-xxl my-3 d-flex flex-row flex-wrap" data-masonry='{"percentPosition": true, "columnWidth": 200, "itemSelector": ".grid-item"}'>
        {
            subjects && sortedTasks.map(([key, value]) => (
                <Task key={key} name={value.title} id={key} due={value.due} category={subjects[value.subject.valueOf()]} desc={value.task} />
            ))
        }
    
    </div>

    {email && <InfoToast message={`Eingeloggt als ${email}`}/>}
    </>
    );
}

export default Dashboard;
