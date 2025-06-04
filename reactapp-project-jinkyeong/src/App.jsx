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
import EditInfo from './components/members/EditRe'; // EditRe 컴포넌트 이름이 EditInfo로 임포트됨

import './style/global.css';

function App() {
  const location = useLocation();

  // currentUser 상태를 App 컴포넌트에서 관리
  // 초기값은 로컬 스토리지에서 가져오거나 null
  const [currentUser, setCurrentUser] = useState(() => {
    try { // localStorage 접근 시 오류 방지를 위해 try-catch 추가
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse currentUser from localStorage", e);
      return null;
    }
  });

  // currentUser 상태가 변경될 때마다 로컬 스토리지에 저장 (현재 로그인된 사용자)
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // 로그인 핸들러: currentUser 상태를 업데이트
  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  // 로그아웃 핸들러: currentUser 상태를 null로 만들고 localStorage에서도 제거
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // 사용자 정보 업데이트 핸들러 (회원정보 수정 시 호출)
  const handleUpdateUser = (updatedUser) => {
    // 1. 현재 로그인된 사용자 정보 업데이트 (UI 반영용)
    setCurrentUser(updatedUser);

    // 2. 로컬 스토리지의 전체 사용자 목록 (registeredUsers) 업데이트
    // 기존 registeredUsers 배열을 가져옴
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // 업데이트된 사용자 정보를 찾아서 교체
    const updatedUsersList = registeredUsers.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );

    // 업데이트된 전체 사용자 목록을 로컬 스토리지에 저장
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsersList));
  };


  // TopNavi와 메인 타이틀을 숨길 경로.
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

      {/* TopNavi에 currentUser와 onLogout prop 전달 */}
      {!shouldHideHeaders && <TopNavi currentUser={currentUser} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/regist" element={<Regist />}></Route>
        <Route path="/login" element={<Login onLogin={handleLogin} />}></Route> {/* prop 이름 'onLogin'으로 일치 */}
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