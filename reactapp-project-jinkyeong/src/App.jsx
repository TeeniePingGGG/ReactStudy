import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';

// 컴포넌트 임포트
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

// 전역 스타일시트
import './style/global.css';

function App() {
    const location = useLocation(); // 현재 라우트 정보를 가져옵니다.

    // 로그인된 사용자 상태 관리 (로컬 스토리지 연동)
    const [loggedInUser, setLoggedInUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('loggedInUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("로컬 스토리지에서 사용자 정보 파싱 실패:", error);
            return null;
        }
    });

    // loggedInUser 상태 변경 시 로컬 스토리지에 저장 또는 삭제
    useEffect(() => {
        try {
            if (loggedInUser) {
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            } else {
                localStorage.removeItem('loggedInUser');
            }
        } catch (error) {
            console.error("로컬 스토리지에 사용자 정보 저장/삭제 실패:", error);
        }
    }, [loggedInUser]);

    // 로그인 핸들러
    const handleLogin = (userData) => {
        setLoggedInUser(userData);
    };

    // 회원 정보 업데이트 함수: EditRe에서 호출되어 loggedInUser 상태를 변경
    const handleUpdateUser = (updatedUserData) => {
        // 등록된 전체 사용자 목록에서도 업데이트
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const updatedRegisteredUsers = registeredUsers.map(user =>
            user.id === updatedUserData.id ? updatedUserData : user
        );
        localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));

        setLoggedInUser(updatedUserData); // 현재 로그인된 사용자 정보 업데이트
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
        setLoggedInUser(null);
    };

    // 헤더를 숨길 경로 목록
    const hideHeadersPaths = ['/chat/talk'];
    const shouldHideHeaders = hideHeadersPaths.includes(location.pathname);

    return (
        <>
            {/* 특정 경로(/chat/talk)에서는 헤더 숨김 */}
            {!shouldHideHeaders && (
                <div className="main-title-area">
                    <NavLink to="/">
                        <h1>아이스크림이 세상을 지배한다.🍦</h1>
                    </NavLink>
                </div>
            )}

            {/* 특정 경로에서는 TopNavi 숨김 */}
            {!shouldHideHeaders && (
                <TopNavi
                    currentUser={loggedInUser}
                    onLogout={handleLogout}
                />
            )}

            {/* 라우트 정의 */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/regist" element={<Regist />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/info" element={<Info currentUser={loggedInUser} />} />
                {/* EditRe 라우트 추가. currentUser와 handleUpdateUser 함수 전달 */}
                <Route
                    path="/editinfo"
                    element={<EditRe
                        currentUser={loggedInUser}
                        onUpdateUser={handleUpdateUser}
                    />}
                />
                <Route path="/cherryjubilee" element={<CherryJubileePage />} />
                <Route path="/applemint" element={<AppleMint />} />
                <Route path="/almondbonbon" element={<Amondbong />} />
                <Route path="/chocotreemint" element={<Chocotree />} />
                <Route path="/cheese" element={<Cheese />} />
                <Route path="/chat">
                    <Route index element={<ChatStart />} />
                    <Route path="talk" element={<ChatMessage />} />
                </Route>
                <Route path="/qna" element={<QnA />} />
                <Route path="/free/*" element={<Free />} />
            </Routes>
        </>
    );
}

export default App;