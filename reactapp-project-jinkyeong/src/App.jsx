import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Regist from './components/members/Regist';
import Home from './components/Home';
import TopNavi from './components/TopNavi';
import Login from './components/members/Login';
import Info from './components/members/Info';
import EditRe from './components/members/EditRe';
import CherryJubileePage from './components/explain/CherryJubileePage';
import AppleMint from './components/explain/AppleMint';
import Amondbong from './components/explain/Amondbong';
import Chocotree from './components/explain/chocotree';
import Cheese from './components/explain/Cheese';
import ChatStart from './components/ChatStart';
import ChatMessage from './components/ChatMessage';
import QnA from './components/board/QnA';
import Free from './components/board/Free';
import './style/global.css';

function App() {
    const location = useLocation();

    const [loggedInUser, setLoggedInUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('loggedInUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse loggedInUser from localStorage", error);
            return null;
        }
    });

    useEffect(() => {
        try {
            if (loggedInUser) {
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            } else {
                localStorage.removeItem('loggedInUser');
            }
        } catch (error) {
            console.error("Failed to save loggedInUser to localStorage", error);
        }
    }, [loggedInUser]);

    const handleLogin = (userData) => {
        setLoggedInUser(userData);
    };

    const handleUpdateUser = (updatedUserData) => {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const updatedRegisteredUsers = registeredUsers.map(user =>
            user.id === updatedUserData.id ? updatedUserData : user
        );
        localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));

        setLoggedInUser(updatedUserData);
    };

    const handleLogout = () => {
        setLoggedInUser(null);
    };

    const hideHeadersPaths = ['/chat/talk'];
    const shouldHideHeaders = hideHeadersPaths.includes(location.pathname);

    return(
        <>
            {!shouldHideHeaders && (
                <div className="main-title-area">
                    <NavLink to="/">
                        <h1>아이스크림이 세상을 지배한다.🍦</h1>
                    </NavLink>
                </div>
            )}

            {!shouldHideHeaders && (
                <TopNavi
                    currentUser={loggedInUser}
                    onLogout={handleLogout}
                />
            )}

            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/regist" element={<Regist/>}></Route>
                <Route path="/login" element={<Login onLogin={handleLogin} />}></Route>
                <Route path="/info" element={<Info currentUser={loggedInUser} />}></Route>
                <Route
                    path="/editinfo"
                    element={<EditRe
                                currentUser={loggedInUser}
                                onUpdateUser={handleUpdateUser}
                            />}
                ></Route>
                <Route path="/cherryjubilee" element={<CherryJubileePage />}></Route>
                <Route path="/applemint" element={<AppleMint />}></Route>
                <Route path="/almondbonbon" element={<Amondbong />}></Route>
                <Route path="/chocotreemint" element={<Chocotree />}></Route>
                <Route path="/cheese" element={<Cheese />}></Route>
                <Route path="/chat">
                    <Route index element={<ChatStart></ChatStart>}></Route>
                    <Route path="talk" element={<ChatMessage></ChatMessage>}></Route>
                </Route>
                <Route path="/qna" element={<QnA />}></Route>
                <Route path="/free/*" element={<Free />}></Route>
            </Routes>
        </>
    );
}

export default App;