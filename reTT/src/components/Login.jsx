import { useState } from "react";

function Login() {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태

  // 로그인 버튼 클릭 시 실행될 함수
  const handleLogin = () => {
    // 로컬 스토리지에서 모든 사용자 데이터 가져오기
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // 입력된 이메일과 비밀번호에 해당하는 사용자를 찾기
    const foundUser = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      alert("로그인 성공!");
      // 실제 앱에서는 로그인 성공 후 사용자 정보를 상태에 저장하거나 다른 페이지로 리다이렉트합니다.
      // 예를 들어, 로그인한 사용자 정보를 전역 상태(Context API, Redux 등)에 저장할 수 있습니다.
      setEmail(""); // 입력 필드 초기화
      setPassword(""); // 입력 필드 초기화
    } else {
      alert("로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <input
        placeholder="이메일"
        value={email} // 상태와 input 값 바인딩
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password} // 상태와 input 값 바인딩
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default Login;