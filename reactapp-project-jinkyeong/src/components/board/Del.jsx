// src/components/board/Del.jsx
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore'; // doc, deleteDoc 임포트
import { firestore } from '../../firestoreConfig'; // firestore 임포트

function Del(props) {
    const navigate = props.navigate;
    const { id } = useParams(); // URL 파라미터에서 Firestore 문서 ID (id)를 가져옵니다.

    const isExecuted = useRef(false);

    useEffect(() => {
        if (isExecuted.current) {
            return;
        }

        const confirmAndDelete = async () => {
            const isConfirmed = window.confirm(`게시물을 정말 삭제하시겠습니까?`);

            if (isConfirmed) {
                try {
                    const postDocRef = doc(firestore, 'board', id);
                    await deleteDoc(postDocRef); // 문서 삭제
                    alert(`게시물이 삭제되었습니다.`);
                    navigate("/free/list"); // 삭제 후 목록 페이지로 이동
                } catch (error) {
                    console.error("게시물 삭제 실패:", error);
                    alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
                    navigate(-1); // 삭제 실패 시 이전 페이지로 돌아감
                }
            } else {
                navigate(-1); // 사용자가 취소하면 이전 페이지로 돌아감
            }
        };

        confirmAndDelete();
        isExecuted.current = true;

    }, [id, navigate]); // id와 navigate에 의존

    return null;
}

export default Del;