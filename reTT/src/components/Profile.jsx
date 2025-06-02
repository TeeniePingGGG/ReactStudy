import { useState } from "react";
import { updateProfile } from "firebase/auth"; // 사용자 프로필 업데이트 함수
import { auth } from "../firebase";

function EditProfile() {
  const [newName, setNewName] = useState(""); // 새 이름 상태 변수

  // '변경하기' 버튼 클릭 시 실행
  const handleUpdate = async () => {
    try {
      // 현재 로그인된 사용자가 있을 경우
      if (auth.currentUser) {
        // 사용자 프로필 업데이트 (예: 이름 변경)
        await updateProfile(auth.currentUser, { displayName: newName });
        alert("이름 변경 성공!");
      }
    } catch (error) {
      alert("에러: " + error.message);
    }
  };

  return (
    <div>
      <h2>회원정보 수정</h2>
      <input placeholder="새 이름" onChange={(e) => setNewName(e.target.value)} />
      <button onClick={handleUpdate}>변경하기</button>
    </div>
  );
}

export default EditProfile;
