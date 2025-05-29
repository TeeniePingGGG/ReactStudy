// src/components/board/Del.jsx
import { useEffect, useRef } from 'react'; // useRef 훅 임포트 추가
import { useParams } from 'react-router-dom';

function Del(props) {
  const boardData = props.boardData;
  const setBoardData = props.setBoardData;
  const navigate = props.navigate;

  const { no } = useParams();
  const pno = Number(no);

  // ⭐⭐ useRef를 사용하여 이펙트가 이미 실행되었는지 추적 ⭐⭐
  const isExecuted = useRef(false);

  useEffect(() => {
    // ⭐⭐ 이펙트가 아직 실행되지 않았을 때만 로직을 실행합니다. ⭐⭐
    // React.StrictMode 때문에 개발 모드에서 두 번 실행될 수 있는 문제를 방지합니다.
    if (isExecuted.current) {
      return; // 이미 실행된 경우, 더 이상 진행하지 않고 종료합니다.
    }

    const confirmAndDelete = () => {
      const isConfirmed = window.confirm(`${pno}번 게시물을 정말 삭제하시겠습니까?`);

      if (isConfirmed) {
        const updatedBoardData = boardData.filter(item => item.no !== pno);
        setBoardData(updatedBoardData);
        alert(`${pno}번 게시물이 삭제되었습니다.`);
        navigate("/free/list");
      } else {
        navigate(-1); // 이전 페이지로 돌아가기
      }
    };

    confirmAndDelete(); // 함수 호출

    isExecuted.current = true; // 로직이 실행되었음을 표시

  }, [pno, boardData, setBoardData, navigate]); // 의존성 배열은 그대로 유지

  return (
    <div>
      <p>게시물 삭제 중...</p>
    </div>
  );
}

export default Del;