import { signOut } from "firebase/auth"; // 로그아웃 함수
import { auth } from "../firebase";

function Logout() {
  const handleLogout = async () => {
    try {
      // Firebase에서 로그아웃 실행
      await signOut(auth);
      alert("로그아웃 완료!");
    } catch (error) {
      alert("에러: " + error.message);
    }
  };

  return (
    <div>
      {/* 로그아웃 버튼 클릭 시 로그아웃 실행 */}
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default Logout;