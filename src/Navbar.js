import SignOutButton from './SignOutButton';


export default function Navbar({optionMenu}) {

    const currentPath = window.location.pathname;

    return (
        <nav className="navbar navbar-expand-lg sticky-top bg-light">
            <div className="container-fluid">

                <a className="navbar-brand" href="#">PlanerApp</a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className={currentPath==="/"? "nav-link active" : "nav-link"} aria-current={ currentPath==="/"? "page" : ""} href="./">Home</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Optionen
                        </a>
                        {optionMenu}
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" aria-disabled="true">Stundenplan</a>
                    </li>

                    <li className="nav-item">
                        <a className={currentPath==="/settings"? "nav-link active" : "nav-link"} aria-current={ currentPath==="/settings"? "page" : ""} href="./settings">Einstellungen</a>
                    </li>
                </ul>
                <div className="d-flex">
                    <SignOutButton />
                </div>
            
                </div>
            </div>
        </nav>
    )
}
