import Navbar from "./Navbar";
import DashboardOptionMenu from "./DashboardOptionMenu";
import EmptyOptionMenu from "./EmptyOptionMenu";
import NewTask from "./NewTask";
import { getSubjects, getTimetable, setBlock } from "./backend";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { getDatabase, ref, child, get, onValue  } from "firebase/database";

const auth = getAuth();
auth.languageCode = "de";

function TimetableSubject({day, block, subjectId, subjects}) {

    

    const [subjectEditMode, setSubjectEditMode] = useState(false);
    const [subject, setSubject] = useState(subjectId);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth]);

    function handleSubjectChange(e) {
        try {
            setBlock(currentUser, day, block, parseInt(e.target.value));
        } catch (error) {
            console.warn(error);
        }
        
    }

    if (!subjectEditMode) {
        return (
            <td onClick={(e) => {setSubjectEditMode(true);}} style={{width: "15%"}}>
                <span id={`subject-${day}-${block}`} >{subjectId===0? "" : subjects[subject]}</span>
            </td>
        );
    }
    else {
        return (
            <td>
                <span>
                    <select 
                    className="form-select" 
                    id={`changeSubject-${day}-${block}`}
                    style={{maxWidth: "90%", margin: "0px", minWidth: "150px"}}
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value);
                        setSubjectEditMode(false);
                        handleSubjectChange(e);
                    
                    }}>
                        
                        {subjects && Object.entries(subjects).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}

                    </select>
                    <button className="btn btn-danger mt-3" onClick={(e) => {setSubjectEditMode(false);}}>Abbrechen</button>
                </span>
            </td>
        )
    }

}


function Timetable() {

    const [subjects, setSubjects] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [timetable, setTimetable] = useState(null);




    useEffect(() => {

        let unsubTimetable = null;
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (unsubTimetable) { unsubTimetable(); unsubTimetable = null; }
            if (user) {
                setCurrentUser(user);



                getSubjects(user).then(data => {
                    setSubjects(data);
                    localStorage.setItem("planerSubjects", JSON.stringify(data));
                });

                getTimetable(user).then(data => {
                    setTimetable(data); 
                    localStorage.setItem("planerTimetable", JSON.stringify(data));
                });

                try {
                    let localTimetable = localStorage.getItem("planerTimetable");
                    let localSubjects = localStorage.getItem("planerSubjects");

                    if (localTimetable !== null && localSubjects !== null) {
                        setTimetable(JSON.parse(localTimetable));
                        setSubjects(JSON.parse(localSubjects));  
                    }

                } catch (e) {
                    console.warn(e);
                }

                
                const timetableRef = ref(getDatabase(), "userdata/" + user.uid + "/timetable/");

                unsubTimetable = onValue(timetableRef, (snapshot) => {
                    const data = snapshot.val();
                    setTimetable(data);
                    localStorage.setItem("planerTimetable", JSON.stringify(data));
                });

            }
        });

        return () => {
            unsubscribe(); // Clean up the subscription on unmount
            if (unsubTimetable) unsubTimetable();
        }
    }, [auth]);

    if (timetable === null) {
        return (
            <>
                <Navbar optionMenu={<EmptyOptionMenu />}/>
                <NewTask/>
            </>
    
        )
    } 

    return (
        <>
            <Navbar optionMenu={<EmptyOptionMenu />}/>
            <NewTask/>

            <div className="container-xxl mt-4" style={{overflowX: "scroll"}}>
                <h2 className="text-center">Stundenplan</h2>
                <table className="table table-responsive table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{width: "10%"}}>Zeit</th>
                            <th>Montag</th>
                            <th>Dienstag</th>
                            <th>Mittwoch</th>
                            <th>Donnerstag</th>
                            <th>Freitag</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>08:00 - 08:45</td>
                            <TimetableSubject day={0} block={0} subjectId={timetable[0][0]} subjects={subjects}/>
                            <TimetableSubject day={1} block={0} subjectId={timetable[1][0]} subjects={subjects}/>
                            <TimetableSubject day={2} block={0} subjectId={timetable[2][0]} subjects={subjects}/>
                            <TimetableSubject day={3} block={0} subjectId={timetable[3][0]} subjects={subjects}/>
                            <TimetableSubject day={4} block={0} subjectId={timetable[4][0]} subjects={subjects}/>

                        </tr>
                        <tr className="">
                            <td>08:50 - 09:35</td>
                            <TimetableSubject day={0} block={1} subjectId={timetable[0][1]} subjects={subjects}/>
                            <TimetableSubject day={1} block={1} subjectId={timetable[1][1]} subjects={subjects}/>
                            <TimetableSubject day={2} block={1} subjectId={timetable[2][1]} subjects={subjects}/>
                            <TimetableSubject day={3} block={1} subjectId={timetable[3][1]} subjects={subjects}/>
                            <TimetableSubject day={4} block={1} subjectId={timetable[4][1]} subjects={subjects}/>
                        </tr>
                        <tr className="table-secondary">
                            <td>09:35 - 09:50</td>
                            <td colspan="5" className="text-center">Große Pause</td>
                        </tr>
                        <tr>
                            <td>09:55 - 10:40</td>
                            <TimetableSubject day={0} block={2} subjectId={timetable[0][2]} subjects={subjects}/>
                            <TimetableSubject day={1} block={2} subjectId={timetable[1][2]} subjects={subjects}/>
                            <TimetableSubject day={2} block={2} subjectId={timetable[2][2]} subjects={subjects}/>
                            <TimetableSubject day={3} block={2} subjectId={timetable[3][2]} subjects={subjects}/>
                            <TimetableSubject day={4} block={2} subjectId={timetable[4][2]} subjects={subjects}/>
                        </tr>
                        <tr>
                            <td>10:45 - 11:30</td>
                            <TimetableSubject day={0} block={3} subjectId={timetable[0][3]} subjects={subjects}/>
                            <TimetableSubject day={1} block={3} subjectId={timetable[1][3]} subjects={subjects}/>
                            <TimetableSubject day={2} block={3} subjectId={timetable[2][3]} subjects={subjects}/>
                            <TimetableSubject day={3} block={3} subjectId={timetable[3][3]} subjects={subjects}/>
                            <TimetableSubject day={4} block={3} subjectId={timetable[4][3]} subjects={subjects}/>
                        </tr>
                        <tr className="table-secondary">
                            <td>11:30 - 11:40</td>
                            <td colspan="5" className="text-center">Kleine Pause</td>
                        </tr>
                        <tr>
                            <td>11:45 - 12:30</td>
                            <TimetableSubject day={0} block={4} subjectId={timetable[0][4]} subjects={subjects}/>
                            <TimetableSubject day={1} block={4} subjectId={timetable[1][4]} subjects={subjects}/>
                            <TimetableSubject day={2} block={4} subjectId={timetable[2][4]} subjects={subjects}/>
                            <TimetableSubject day={3} block={4} subjectId={timetable[3][4]} subjects={subjects}/>
                            <TimetableSubject day={4} block={4} subjectId={timetable[4][4]} subjects={subjects}/>
                        </tr>
                        <tr>
                            <td>12:35 - 13:20</td>
                            <TimetableSubject day={0} block={5} subjectId={timetable[0][5]} subjects={subjects}/>
                            <TimetableSubject day={1} block={5} subjectId={timetable[1][5]} subjects={subjects}/>
                            <TimetableSubject day={2} block={5} subjectId={timetable[2][5]} subjects={subjects}/>
                            <TimetableSubject day={3} block={5} subjectId={timetable[3][5]} subjects={subjects}/>
                            <TimetableSubject day={4} block={5} subjectId={timetable[4][5]} subjects={subjects}/>
                        </tr>
                        <tr className="table-secondary">
                            <td>13:20 - 13:55</td>
                            <td colspan="5" className="text-center">Mittagspause</td>
                        </tr>
                        <tr>
                            <td>14:00 - 14:45</td>
                            <TimetableSubject day={0} block={6} subjectId={timetable[0][6]} subjects={subjects}/>
                            <TimetableSubject day={1} block={6} subjectId={timetable[1][6]} subjects={subjects}/>
                            <TimetableSubject day={2} block={6} subjectId={timetable[2][6]} subjects={subjects}/>
                            <TimetableSubject day={3} block={6} subjectId={timetable[3][6]} subjects={subjects}/>
                            <TimetableSubject day={4} block={6} subjectId={timetable[4][6]} subjects={subjects}/>
                        </tr>
                        <tr>
                            <td>14:45 - 15:30</td>
                            <TimetableSubject day={0} block={7} subjectId={timetable[0][7]} subjects={subjects}/>
                            <TimetableSubject day={1} block={7} subjectId={timetable[1][7]} subjects={subjects}/>
                            <TimetableSubject day={2} block={7} subjectId={timetable[2][7]} subjects={subjects}/>
                            <TimetableSubject day={3} block={7} subjectId={timetable[3][7]} subjects={subjects}/>
                            <TimetableSubject day={4} block={7} subjectId={timetable[4][7]} subjects={subjects}/>
                        </tr>
                        <tr>
                            <td>15:30 - 16:15</td>
                            <TimetableSubject day={0} block={8} subjectId={timetable[0][8]} subjects={subjects}/>
                            <TimetableSubject day={1} block={8} subjectId={timetable[1][8]} subjects={subjects}/>
                            <TimetableSubject day={2} block={8} subjectId={timetable[2][8]} subjects={subjects}/>
                            <TimetableSubject day={3} block={8} subjectId={timetable[3][8]} subjects={subjects}/>
                            <TimetableSubject day={4} block={8} subjectId={timetable[4][8]} subjects={subjects}/>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Timetable;