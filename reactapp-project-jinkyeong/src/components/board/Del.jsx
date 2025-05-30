import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firestoreConfig';

function Del(props) {
    const navigate = props.navigate;
    const { id } = useParams();

    useEffect(() => {
        const confirmAndDelete = async () => {
            const isConfirmed = window.confirm(`게시물을 정말 삭제하시겠습니까?`);

            if (isConfirmed) {
                try {
                    const postDocRef = doc(firestore, 'board', id);
                    await deleteDoc(postDocRef);
                    alert(`게시물이 삭제되었습니다.`);
                    navigate("/free/list");
                } catch (error) {
                    console.error("게시물 삭제 실패:", error);
                    alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
                    navigate(-1);
                }
            } else {
                navigate(-1);
            }
        };

        confirmAndDelete();
    }, [id, navigate]);

    return null;
}

export default Del;