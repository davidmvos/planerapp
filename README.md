# Hausaufgaben-Planer
*React version*

Dieser Hausaufgaben-Planer läfut mit Hilfe von **React** und **Firebase**.

## Features
- Account-Management mit Firebase Authentication Service
- Erstellen und Löschen von Hausaufgaben
- RealtimeDB mit JSON-Struktur
- Bootstrap Design

## Installation

Damit dieses projekt selber ausgeführt werden kann, muss man die Datei `.env` im Projektordner anlegen.

**Diese Daten bekommt man auch, wenn man eine neue Firebase app registriert. Dort fehlt aber die `databaseURL`, weshalb sie auf jeden Fall ergäntzt werden muss!**
```txt
REACT_APP_API_KEY="..."
REACT_APP_AUTH_DOMAIN="..."
REACT_APP_PROJECT_ID="..."
REACT_APP_STORAGE_BUCKET="..."
REACT_APP_MESSAGING_SENDER_ID="..."
REACT_APP_APP_ID="..."
REACT_APP_MEASUREMENT_ID="..."
REACT_APP_DATABASE_URL="..."
```

## Roadmap
- Accountverwaltung
- Stundenplan
- Reminder
- Geteilte Aufgaben