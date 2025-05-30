import { NavLink, useNavigate } from "react-router-dom";
import '../style/global.css';

function TopNavi({currentUser, onLogout}) {
    const navigate = useNavigate();

    const handleLogout = ()=>{
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

            {currentUser ? (
                <>
                    <NavLink to="/info" className="user-greeting">
                        {currentUser.name}님
                    </NavLink>
                    <button onClick={handleLogout} className="logout-btn">로그아웃</button>
                </>
            ) : (
                <>
                    <NavLink to="/regist">회원가입</NavLink>
                    <NavLink to="/login">로그인</NavLink>
                </>
            )}
        </nav>
    );
}
export default TopNavi;