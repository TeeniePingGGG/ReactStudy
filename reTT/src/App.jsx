import { useState } from "react";

// 각 기능별 컴포넌트 import
// 기존 SignUp 컴포넌트 대신, 더 복잡한 회원가입 폼을 가진 Sign 컴포넌트를 가져옵니다.
import Sign from "./components/Signup"; // './components/Sign.jsx' 파일에서 Sign 컴포넌트를 import

import Login from "./components/Login";
import Logout from "./components/Logout"; // Logout 컴포넌트가 있다면 그대로 유지

// 주의: EditProfile 컴포넌트는 현재 import 되어있지 않습니다.
// 필요에 따라 EditProfile.jsx 파일을 생성하고 아래 주석을 해제해주세요.
// import EditProfile from "./components/EditProfile";

function App() {
  // 현재 보여줄 화면 상태: signup, login, edit, logout 중 하나
  const [currentView, setCurrentView] = useState("login"); // 초기 화면은 'login'

  // 화면 전환 함수 - 버튼 클릭 시 실행
  const changeView = (viewName) => {
    setCurrentView(viewName); // viewName: 'signup', 'login', 'edit', 'logout'
  };

  // 화면 상태에 따라 알맞은 컴포넌트를 렌더링
  const renderView = () => {
    switch (currentView) {
      case "signup":
        return <Sign />; // '회원가입' 버튼 클릭 시, Sign 컴포넌트(상세 회원가입 폼) 렌더링
      case "login":
        return <Login />;
      case "edit":
        // EditProfile 컴포넌트가 아직 구현되지 않았다면, 임시 메시지를 표시합니다.
        // return <EditProfile />; // EditProfile 컴포넌트가 준비되면 이 줄의 주석을 해제하세요.
        return <div>정보수정 컴포넌트 준비 중...</div>;
      case "logout":
        return <Logout />;
      default:
        return <Login />;
    }
  };

  return (
    <div>
      {/* 상단 네비게이션 버튼 - 화면 전환 */}
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => changeView("signup")}>회원가입</button>
        <button onClick={() => changeView("login")}>로그인</button>
        <button onClick={() => changeView("edit")}>정보수정</button>
        <button onClick={() => changeView("logout")}>로그아웃</button>
      </nav>

      {/* 실제로 화면에 보일 컴포넌트 렌더링 */}
      {renderView()}
    </div>
  );
}

export default App;