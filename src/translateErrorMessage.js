export function translateErrorMessage(msg) {
    const userInputErrors = {
        "auth/user-not-found": "Account nicht vorhanden!",
        "auth/invalid-email": "Ungültige Zugangsdaten!",
        "auth/invalid-password": "Ungültige Zugangsdaten!",
        "auth/invalid-credential": "Ungültige Zugangsdaten!",
        "auth/wrong-password": "Ungültige Zugangsdaten!",
        "auth/wrong-email": "Ungültige Zugangsdaten!"
    }

    if (Object.prototype.hasOwnProperty.call(userInputErrors, msg)) {
        return userInputErrors[msg];
    } else {
        return false;
    }
    
}