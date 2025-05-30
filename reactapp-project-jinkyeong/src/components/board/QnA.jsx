import { useState, useEffect } from "react";
// Firebase Firestore 관련 임포트
import { collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firestoreConfig'; // firestore 객체 임포트

// 기존 nowDate 함수 (날짜 형식 유지)
const nowDate = () => {
    let dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = ("0" + (1 + dateObj.getMonth())).slice(-2);
    var day = ("0" + dateObj.getDate()).slice(-2);

    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${year}년 ${month}월 ${day}일 ${ampm} ${hours}:${formattedMinutes}`;
};

// --- BoardView 컴포넌트 (변화 없음) ---
function BoardView() {
    return (
        <>
            <div className="card mb-4 board-view-card">
                <div className="card-body">
                    <h5 className="card-title board-view-title">Q&A 게시판(궁금한거 다 물어봐!)</h5>
                </div>
            </div>
        </>
    );
}

// --- CommentBtn 컴포넌트 (변화 없음) ---
const CommentBtn = (props) => {
    return (
        <>
            <button
                className="btn btn-primary comment-write-btn"
                data-bs-toggle="modal"
                data-bs-target="#commentModal"
                onClick={() => props.newOpenModal()}
            >
                물어보기!
            </button>
        </>
    );
};

// --- ModalWindow 컴포넌트 (변화 없음, 내부 로직은 QnA 컴포넌트에서 처리) ---
function ModalWindow(props) {
    return (
        <>
            <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="commentModalLabel">Q&A</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="commentAuthor" className="form-label">작성자명</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="commentAuthor"
                                    placeholder="이름을 입력하세요"
                                    value={props.iWriter}
                                    onChange={(e) => props.setIWriter(e.target.value)}
                                />
                            </div>
                            <label htmlFor="commentContent" className="form-label">질문</label>
                            <textarea
                                className="form-control"
                                id="commentContent"
                                rows="3"
                                placeholder="글 내용을 입력하세요"
                                value={props.iContents}
                                onChange={(e) => props.setIContents(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                            <button type="button" className="btn btn-primary" onClick={props.saveComment} data-bs-dismiss="modal">작성</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// --- CommentList 컴포넌트 (idx 대신 id 사용) ---
function CommentList(props) {
    // 날짜 형식을 변경하는 헬퍼 함수
    const formatDateTime = (postDateString) => {
        if (!postDateString || typeof postDateString !== 'string') return '';

        // nowDate 함수에서 반환하는 "YYYY년 MM월 DD일 오전/오후 HH:MM" 형태 파싱
        const dateMatch = postDateString.match(/(\d{4})년 (\d{2})월 (\d{2})일 (오전|오후) (\d{1,2}):(\d{2})/);
        
        if (dateMatch) {
            const year = dateMatch[1];
            const month = dateMatch[2];
            const day = dateMatch[3];
            let hours = parseInt(dateMatch[5], 10);
            const minutes = dateMatch[6];
            const ampm = dateMatch[4];

            if (ampm === '오후' && hours !== 12) {
                hours += 12;
            } else if (ampm === '오전' && hours === 12) {
                hours = 0; // 자정 12시는 0시로
            }
            return `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${minutes}`;
        }
        // Fallback for ISOString or other formats if they somehow get there
        try {
            const date = new Date(postDateString);
            if (!isNaN(date.getTime())) { // 유효한 Date 객체인지 확인
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}`;
            }
        } catch (e) {
            console.error("Failed to parse date string:", postDateString, e);
        }
        return postDateString; // 파싱 실패 시 원본 반환
    };

    // 현재 페이지에 해당하는 댓글만 필터링
    const startIndex = (props.currentPage - 1) * props.commentsPerPage;
    const endIndex = startIndex + props.commentsPerPage;
    const currentComments = props.boardData.slice(startIndex, endIndex);

    return (
        <>
            {currentComments.map((row) => { // 필터링된 댓글만 맵핑
                return (
                    // row.idx 대신 row.id를 key로 사용
                    <ul className="list-group mt-3 comment-list" key={row.id}> 
                        <li className="list-group-item comment-list-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <strong className="comment-writer">{row.writer}</strong>{" "}
                                    <small className="ms-2 comment-date">{formatDateTime(row.postdate)}</small>
                                </div>
                                <div>
                                    {/* idx 대신 id 사용 */}
                                    <button className="btn btn-outline-success btn-sm comment-action-btn like-btn" onClick={() => props.likePlus(row.id)}>
                                        좋아요 ({row.likes})
                                    </button>&nbsp;
                                    <button className="btn btn-outline-warning btn-sm comment-action-btn edit-btn" data-bs-toggle="modal" data-bs-target="#commentModal" onClick={() => props.editComment(row.id)}>
                                        수정
                                    </button>&nbsp;
                                    <button className="btn btn-outline-danger btn-sm comment-action-btn delete-btn" onClick={() => props.deleteComment(row.id)}>
                                        삭제
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 mb-0 comment-contents">
                                {row.contents}
                            </p>
                        </li>
                    </ul>
                );
            })}
        </>
    );
}

// 페이징 컴포넌트 (변화 없음)
function Pagination({ commentsPerPage, totalComments, paginate, currentPage }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalComments / commentsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="d-flex justify-content-center mt-5">
            <ul className="pagination comment-pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} href="#!" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}


const QnA = () => { // 컴포넌트 이름이 'QnA'이므로 통일합니다.
    // 초기 boardData를 빈 배열로 변경하여 Firestore에서 데이터를 가져오도록 합니다.
    const [boardData, setBoardData] = useState([]); 
    
    // 페이징 관련 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [commentsPerPage] = useState(3); // 페이지당 댓글 수

    //입력상자
    const [iWriter, setIWriter] = useState('');
    const [iContents, setIContents] = useState('');
    const [editId, setEditId] = useState(null); // idx 대신 id 사용 (Firestore 문서 ID)
    
    // nextVal 시퀀스 제거 (Firestore가 자동 ID 생성)
    // const [nextVal, setNextVal] = useState(7); 

    // **Helper 함수: 데이터를 날짜(최신순)으로 정렬**
    // 이 함수는 Firestore에서 이미 정렬해서 가져오므로 필요 없게 됩니다.
    // const sortBoardData = (data) => {
    //     return [...data].sort((a, b) => new Date(b.postdate) - new Date(a.postdate));
    // };

    // Firestore에서 데이터 가져오기 (useEffect)
    useEffect(() => {
        const qnaCollectionRef = collection(firestore, 'qna'); // 'qna' 컬렉션 사용
        // postdate를 기준으로 내림차순 정렬 (최신 글이 먼저 오도록)
        const q = query(qnaCollectionRef, orderBy('postdate', 'desc')); 

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                posts.push({ id: doc.id, ...data }); // Firestore 문서 ID를 'id'로 저장
            });
            setBoardData(posts);
            // setNextVal(maxNo + 1); // nextVal 로직은 이제 Firestore에 의존하지 않습니다.
        }, (error) => {
            console.error("Firestore 데이터 로드 오류:", error);
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return () => unsubscribe(); 
    }, []); // 최초 렌더링 시 한 번만 실행


    //댓글 작성 및 수정 (Firestore 연동)
    const saveComment = async () => { // 비동기 함수로 변경
        if (iWriter.trim() === '' || iContents.trim() === '') {
            alert('작성자와 내용을 모두 입력해주세요!');
            return;
        }

        try {
            if (editId === null) {
                // 댓글 작성: Firestore에 새 문서 추가
                await addDoc(collection(firestore, 'qna'), { // 'qna' 컬렉션에 추가
                    writer: iWriter,
                    postdate: nowDate(), // 현재 날짜 시간 (형식 유지)
                    contents: iContents,
                    likes: 0,
                });
                alert('질문이 작성되었습니다!');
            } else {
                // 댓글 수정: 기존 문서 업데이트
                const postDocRef = doc(firestore, 'qna', editId); // 문서 참조 (editId는 문서의 ID)
                await updateDoc(postDocRef, {
                    writer: iWriter,
                    contents: iContents,
                    // postdate는 수정 시 변경하지 않는 것이 일반적입니다.
                    // postdate: nowDate(), // 필요하다면 업데이트
                });
                alert('질문이 수정되었습니다!');
            }
        } catch (error) {
            console.error("Firestore 작업 실패:", error);
            alert("게시물 작성/수정에 실패했습니다. 다시 시도해주세요.");
        }

        // 입력 폼 초기화 및 페이지 이동
        setIWriter('');
        setIContents('');
        setEditId(null); 
        setCurrentPage(1); // 새 댓글/수정 후 1페이지로 이동
    };

    //좋아요 (Firestore 연동)
    const likePlus = async (id) => { // 비동기 함수로 변경 (idx 대신 id)
        try {
            const postDocRef = doc(firestore, 'qna', id);
            // 현재 좋아요 수를 가져와서 1 증가
            // Optimistic update를 사용하면 사용자 경험이 좋지만, 여기서는 데이터를 읽고 업데이트하는 방식 사용
            const currentPost = boardData.find(item => item.id === id);
            if (currentPost) {
                await updateDoc(postDocRef, {
                    likes: currentPost.likes + 1
                });
            }
        } catch (error) {
            console.error("좋아요 업데이트 실패:", error);
            alert("좋아요 업데이트에 실패했습니다.");
        }
    };

    //댓글삭제 (Firestore 연동)
    const deleteComment = async (id) => { // 비동기 함수로 변경 (idx 대신 id)
        if (window.confirm('질문을 삭제할까요?')) {
            try {
                const postDocRef = doc(firestore, 'qna', id);
                await deleteDoc(postDocRef); // Firestore 문서 삭제
                alert('질문이 삭제되었습니다!');

                const totalPages = Math.ceil((boardData.length - 1) / commentsPerPage); 
                if (currentPage > totalPages && totalPages > 0) {
                    setCurrentPage(totalPages);
                } else if (boardData.length - 1 === 0) { 
                    setCurrentPage(1);
                }

            } catch (error) {
                console.error("게시물 삭제 실패:", error);
                alert("게시물 삭제에 실패했습니다.");
            }
        }
    };

    //댓글수정 데이터 로드 (idx 대신 id)
    const editComment = (id) => { 
        console.log(`${id}번 게시물 수정하기`);
        const editData = boardData.find((row) => row.id === id); 
        if (editData) {
            setIWriter(editData.writer);
            setIContents(editData.contents);
            setEditId(id); 
        }
    };

    const newOpenModal = () => {
        setIWriter('');
        setIContents('');
        setEditId(null); 
    };

    // 페이지 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="container mt-4 free-board-container">
                <BoardView />
                <CommentBtn newOpenModal={newOpenModal} />
                <ModalWindow
                    saveComment={saveComment}
                    iWriter={iWriter}
                    setIWriter={setIWriter}
                    iContents={iContents}
                    setIContents={setIContents}
                />
                <CommentList 
                    boardData={boardData} // Firestore에서 이미 정렬해서 가져오므로 sortBoardData 제거
                    likePlus={likePlus} 
                    deleteComment={deleteComment} 
                    editComment={editComment}
                    currentPage={currentPage} 
                    commentsPerPage={commentsPerPage}
                />
                <Pagination
                    commentsPerPage={commentsPerPage}
                    totalComments={boardData.length} // 총 댓글 수는 Firestore에서 가져온 boardData의 길이를 사용
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </>
    );
};

export default QnA; // 컴포넌트 이름에 맞춰 export