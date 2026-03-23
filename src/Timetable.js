import Navbar from "./Navbar";
import DashboardOptionMenu from "./DashboardOptionMenu";
import EmptyOptionMenu from "./EmptyOptionMenu";
import NewTask from "./NewTask";

function Timetable() {
    return (
        <>
            <Navbar optionMenu={<EmptyOptionMenu />}/>
            <NewTask/>
        
        </>
    )
}

export default Timetable;