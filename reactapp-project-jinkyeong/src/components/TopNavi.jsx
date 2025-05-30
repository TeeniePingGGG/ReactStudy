import { NavLink, useNavigate } from "react-router-dom";
import '../style/global.css';

function TopNavi({ currentUser, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        alert('로그아웃 되었습니다');
        navigate('/');
    };

    return (
        <nav className="top-navi-wrapper">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/chat">채팅</NavLink>
            <NavLink to="/qna">Q&A</NavLink>
            <NavLink to="/free">자유게시판</NavLink>

            {currentUser ? ( // 로그인 상태일 때
                <>
                    {/* 사용자 이름 클릭 시 회원정보 페이지로 이동 */}
                    <NavLink to="/info" className="user-greeting">
                        {currentUser.name}님
                    </NavLink>
                    {/* 로그아웃 버튼 */}
                    <button onClick={handleLogout} className="logout-btn">로그아웃</button>
                </>
            ) : ( // 로그인 상태가 아닐 때
                <>
                    <NavLink to="/regist">회원가입</NavLink>
                    <NavLink to="/login">로그인</NavLink>
                </>
            )}
        </nav>
    );
}
export default TopNavi;