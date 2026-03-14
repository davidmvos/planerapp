import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Dashboard from './Dashboard';

import Login from './Login';
import CheckLoginExample from './CheckLoginExample';
import { initializeApp } from 'firebase/app';
import { getLoggedIn } from './backend';

import bootstrap from 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from './Signup';
import Settings from './Settings';

const auth = getAuth();

const App = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user);
        // User is logged in, no need to navigate
      } else {

        console.log('User not logged in');

        if (currentPath !== '/login' && currentPath !== '/signup') {
          navigate('/login'); // Redirect to /login if not logged in
        }
        
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [auth, navigate]);
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login inline={false} disableSignup={false}/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/test" element={<CheckLoginExample />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //  <h1>Hallo Welt!</h1>
  // </React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
