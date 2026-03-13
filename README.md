# Hausaufgaben-Planer
*React version*

Dieser Hausaufgaben-Planer läfut mit Hilfe von **React** und **Firebase**.

## Features
- Account-Management mit Firebase Authentication Service
- Erstellen und Löschen von Hausaufgaben
- RealtimeDB mit JSON-Struktur
- Bootstrap Design

## Installation

Damit dieses projekt selber ausgeführt werden kann, muss man die Datei `env.js` im src-Ordner anlegen, bevor man das Projekt kompiliert. Dort muss folgende Struktur vorhanden sein. 

**Diese Daten bekommt man auch, wenn man eine neue Firebase app registriert. Dort fehlt aber die `databaseURL`, weshalb sie auf jeden Fall ergäntzt werden muss!**
```js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "", // optional
    databaseURL: "" // URL des RealtimeDB servers
};

const app = initializeApp(firebaseConfig);

export default app;
```

## Roadmap
- Accountverwaltung
- Stundenplan
- Reminder
- Geteilte Aufgaben