import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Regist from './components/members/Regist';
import Home from './components/Home';
import TopNavi from './components/TopNavi';
import Login from './components/members/Login';
import CherryJubileePage from './components/explain/CherryJubileePage';
import AppleMint from './components/explain/AppleMint';
import Amondbong from './components/explain/Amondbong';
import Chocotree from './components/explain/chocotree';
import Cheese from './components/explain/Cheese';
import ChatStart from './components/ChatStart';
import ChatMessage from './components/ChatMessage';
import QnA from './components/board/QnA';
import Free from './components/board/Free';
import Info from './components/members/Info';
import EditInfo from './components/members/EditRe'; 

import './style/global.css';

function App() {
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(() => {
    try { 
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse currentUser from localStorage", e);
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const updatedUsersList = registeredUsers.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );

    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsersList));
  };


  const hideHeadersPaths = ['/chat/talk'];
  const shouldHideHeaders = hideHeadersPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeaders && (
        <div className="main-title-area">
          <NavLink to="/">
            <h1>아이스크림이 세상을 지배한다.🍦</h1>
          </NavLink>
        </div>
      )}

      {/* 특정 조건에만 웹사이트 상단에 네비게이션바를 표시*/}
      {!shouldHideHeaders && <TopNavi currentUser={currentUser} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/regist" element={<Regist />}></Route>
        <Route path="/login" element={<Login onLogin={handleLogin} />}></Route> 
        <Route path="/info" element={<Info currentUser={currentUser} />}></Route>
        <Route path="/editinfo" element={<EditInfo currentUser={currentUser} onUpdateUser={handleUpdateUser} />}></Route>

        <Route path="/cherryjubilee" element={<CherryJubileePage />}></Route>
        <Route path="/applemint" element={<AppleMint />}></Route>
        <Route path="/almondbonbon" element={<Amondbong />}></Route>
        <Route path="/chocotreemint" element={<Chocotree />}></Route>
        <Route path="/cheese" element={<Cheese />}></Route>
        <Route path="/chat">
          <Route index element={<ChatStart />}></Route>
          <Route path="talk" element={<ChatMessage />}></Route>
        </Route>
        <Route path="/qna" element={<QnA />}></Route>
        <Route path="/free/*" element={<Free />}></Route>
      </Routes>
    </>
  );
}

export default App;