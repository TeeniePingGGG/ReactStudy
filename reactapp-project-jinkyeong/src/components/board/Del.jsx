import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firestoreConfig';

function Del(props) {
    const navigate = props.navigate;
    const { id } = useParams(); // URL 파라미터에서 'id'값(삭제할 게시물의 ID) 가져옴

    useEffect(() => {
        //게시물 삭제 학인 및 실행을 위한 비동기 함수
        const confirmAndDelete = async () => {
            const isConfirmed = window.confirm(`게시물을 정말 삭제하시겠습니까?`);

            if (isConfirmed) { // 사용자가 확인을 눌렀을때
                try {
                    const postDocRef = doc(firestore, 'board', id); //board 컬렉션에서 특정 id를 사진 게시물에 대한 참조 생성
                    await deleteDoc(postDocRef); // 해당 문서 삭제
                    alert(`게시물이 삭제되었습니다.`);
                    navigate("/free/list");
                } catch (error) {
                    console.error("게시물 삭제 실패:", error);
                    alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
                    navigate(-1);
                }
            } else {
                navigate(-1); // 이전 페이지로 이동
            }
        };

        confirmAndDelete();
    }, [id, navigate]); 

    return null; 
}

export default Del;