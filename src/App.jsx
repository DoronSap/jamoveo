import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import User_register from './User_register.jsx'; // adjust paths
import User_login from './User_login.jsx';
import User_mainPage from "./User_mainPage.jsx";
import Admin_register from "./Admin_register.jsx";
import Admin_mainPage from "./Admin_mainPage.jsx";
import { seedSongsOnce} from "./songs.js";
import Live_Page from "./Live_Page.jsx";

export default function App() {

    useEffect(() => {
        (async () => {
            await seedSongsOnce();
        })();
    }, []);



    return (
        <Router>
            <div>
                <nav style={{ margin: '1rem' }}>
                    <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
                    <Link to="/login">Login</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<User_register />} />
                    <Route path="/register-admin" element={<Admin_register />} />
                    <Route path="/register" element={<User_register />} />
                    <Route path="/login" element={<User_login />} />
                    <Route path="/main" element={<User_mainPage />} />
                    <Route path="/main-admin" element={<Admin_mainPage />} />
                    <Route path="/live-page" element={<Live_Page/>} />
                </Routes>
            </div>
        </Router>
    );
}
