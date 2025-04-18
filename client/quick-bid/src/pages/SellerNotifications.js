import { useEffect, useState } from 'react';
import useAI2 from '../hooks/useAI2.js';

function SellerNotifications() {
    const [notifications, setNotifications] = useState([]);
    const AI2 = useAI2();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await AI2.get('/notifications/');
                setNotifications(response.data);
            } catch (e) {
                console.error("Error fetching notifications:", e);
            }
        };

        fetchNotifications();
    }, [AI2]);

    return (
        <div className="container mt-4">
            <h4>Your Notifications</h4>
            <ul className="list-group">
                {notifications.length > 0 ? notifications.map(notif => (
                    <li className="list-group-item" key={notif.id}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>{notif.message}</span>
                            <small className="text-muted">{new Date(notif.created_at).toLocaleString()}</small>
                        </div>
                    </li>
                )) : (
                    <li className="list-group-item">No notifications yet.</li>
                )}
            </ul>
        </div>
    );
}

export default SellerNotifications;
