import { NavLink } from "react-router-dom";
import '../style/global.css';

function TopNavi(props) {
  return (
    <nav className="top-navi-wrapper"> 
      <NavLink to="/">Home</NavLink>
      <NavLink to="/regist">회원가입</NavLink>
      <NavLink to="/login">로그인</NavLink>
      <NavLink to="/chat">채팅</NavLink>
    </nav>
  );
}
export default TopNavi;