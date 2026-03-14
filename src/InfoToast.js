import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function InfoToast({ message }) {
    const [showToast, setShowToast] = useState(false);

    // Effect to show the toast when the message is provided
    useEffect(() => {
        if (message) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000); // Automatically hide after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className={`toast-container border-0 position-fixed bottom-0 end-0 p-3 ${showToast ? 'd-block' : 'd-none'}`}>
            <div id="liveToast" className={`toast ${showToast ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <strong className="me-auto">Info</strong>
                    <small></small>
                    <button type="button" className="btn-close" onClick={() => setShowToast(false)} aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    {message}
                </div>
            </div>
        </div>
    );
}
