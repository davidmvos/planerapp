
import { getAuth, onAuthStateChanged } from "firebase/auth";

var logged_in = false;

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    logged_in = true;
  } else {

  }
});

function CheckLoginExample() {
    if (logged_in) {
        return (
            <>
            <p>Login erfolgreich!</p>
            </>
        )
    } else {
        <>
        <p>Nicht eingeloggt!</p>
        </>
    }
}


export default CheckLoginExample;