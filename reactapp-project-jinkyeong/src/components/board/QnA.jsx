import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firestoreConfig'; 

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

//게시물 날짜를 화면에 표시하기 적절한 형식으로 변환하는 함수(오늘 날짜는 시간까지, 아니면 년 월 일만 표시)
const formatDisplayDate = (postDateString) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    if (!postDateString || typeof postDateString !== 'string') {
        console.warn("formatDisplayDate: Invalid postDateString provided:", postDateString);
        return "";
    }

    //년 월 일 정보 추출(정규식 사용)
    const yearMatch = postDateString.match(/(\d{4})년/);
    const monthMatch = postDateString.match(/(\d{2})월/);
    const dayMatch = postDateString.match(/(\d{2})일/);

    const postYear = parseInt(yearMatch[1], 10);
    const postMonth = parseInt(monthMatch[1], 10);
    const postDay = parseInt(dayMatch[1], 10);

    if (postYear === currentYear && postMonth === currentMonth && postDay === currentDay) {
        return postDateString;
    } else {
        return `${postYear}년 ${monthMatch[0]} ${dayMatch[0]}`;
    }a
};


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

//질문 작성 및 수정 모달 컴포넌트
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

//질문 목록을 렌더링하는 컴포넌트
function CommentList(props) {
    //Firestore에서 가져온 문자열을 날짜 형식에 맞게 변환해주는 함수
    const formatDateTime = (postDateString) => {
        if (!postDateString || typeof postDateString !== 'string') return '';

        //파싱
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
                hours = 0; 
            }
            return `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${minutes}`;
        }

        try {
            const date = new Date(postDateString);
            if (!isNaN(date.getTime())) { 
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
        return postDateString;  // 파싱 실패시 원본 문자열 반환
    };

    //현재 페이지에 표시할 질문의 시작 인덱스 계산                                              
    const startIndex = (props.currentPage - 1) * props.commentsPerPage;
    //현재 페이지에 표시할 질문들의 끝 인덱스 계산      
    const endIndex = startIndex + props.commentsPerPage;
    //전체 질문 데이터에서 현재 페이지에 해당하는 질문들만 추출
    const currentComments = props.boardData.slice(startIndex, endIndex);

    return (
        <>
            {/* 현재 페이지의 질문들을 매핑하여 렌더링 */}
            {currentComments.map((row) => { 
                return (
                    <ul className="list-group mt-3 comment-list" key={row.id}> 
                        <li className="list-group-item comment-list-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <strong className="comment-writer">{row.writer}</strong>{" "}
                                    <small className="ms-2 comment-date">{props.formatDisplayDate(row.postdate)}</small>
                                </div>
                                <div>
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

function Pagination({ commentsPerPage, totalComments, paginate, currentPage }) {
    const pageNumbers = [];
    
    //전체 질문 수와 페이지당 질문 수를 기반으로 총 페이지 번호 계산
    for (let i = 1; i <= Math.ceil(totalComments / commentsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="d-flex justify-content-center mt-5">
            <ul className="pagination comment-pagination">
                {/* 각 페이지 번호 렌더링 */}
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

//Q&A 게시판의 모든 로직과 상태를 관리하는 메인 컴포넌트
const QnA = () => { 
    const [boardData, setBoardData] = useState([]); //게시판 데이터 저장, firebase에 실시간으로 불러옴
    
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호를 저장
    const [commentsPerPage] = useState(3); //한 페이지에 표시할 질문의 개수

    const [iWriter, setIWriter] = useState('');
    const [iContents, setIContents] = useState('');
    const [editId, setEditId] = useState(null); 
    
    useEffect(() => {
        const qnaCollectionRef = collection(firestore, 'qna'); //qna 컬렉션 참조
        const q = query(qnaCollectionRef, orderBy('postdate', 'desc')); //postdate를 기준으로 내림차순 정렬

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                posts.push({ id: doc.id, ...data }); 
            });
            setBoardData(posts);
        }, (error) => {
            console.error("Firestore 데이터 로드 오류:", error);
        });

        return () => unsubscribe(); 
    }, []); // 컴포넌트 마운트 시 한번만 실행

    //질문 저장
    const saveComment = async () => { 
        if (iWriter.trim() === '' || iContents.trim() === '') {
            alert('작성자와 내용을 모두 입력해주세요!');
            return;
        }

        try {
            if (editId === null) {
                await addDoc(collection(firestore, 'qna'), {  //qna 컬렉션에 새 문서 추가
                    writer: iWriter,
                    postdate: nowDate(), 
                    contents: iContents,
                    likes: 0,
                });
                alert('질문이 작성되었습니다!');
            } 
            else {
                const postDocRef = doc(firestore, 'qna', editId); // 수정할 문서 참조
                await updateDoc(postDocRef, {
                    writer: iWriter,
                    contents: iContents,
                });
                alert('질문이 수정되었습니다!');
            }
        } catch (error) {
            console.error("Firestore 작업 실패:", error);
            alert("게시물 작성/수정에 실패했습니다. 다시 시도해주세요.");
        }

        setIWriter('');
        setIContents('');
        setEditId(null); 
                    const postDocRef = doc(firestore, 'qna', id); // 해당 ID의 문서 참조
        setCurrentPage(1); // 작성, 수정 후 1페이지로 이동
    };

    // 좋아요 수 증가 함수
    const likePlus = async (id) => { 
        try {
            const postDocRef = doc(firestore, 'qna', id); //id문서 참조
            const currentPost = boardData.find(item => item.id === id); // 현재 게시물의 데이터 찾기

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

    //질문 삭제 함수
    const deleteComment = async (id) => { 
        if (window.confirm('질문을 삭제할까요?')) {
            try {
                const postDocRef = doc(firestore, 'qna', id);
                await deleteDoc(postDocRef); // 문서 삭제
                alert('질문이 삭제되었습니다!');

                //삭제 후 총 페이지 수 재계산
                const totalPages = Math.ceil((boardData.length - 1) / commentsPerPage);  
                if (currentPage > totalPages && totalPages > 0) { // 현재 페이지가 총 페이지 수 초과하면
                    setCurrentPage(totalPages); // 마지막 페이지로 이동
                } else if (boardData.length - 1 === 0) {  // 마지막 질문이 삭제되어 게시물이 없으면
                    setCurrentPage(1); // 1페이지로 설정(빈 페이지)
                }

            } catch (error) {
                console.error("게시물 삭제 실패:", error);
                alert("게시물 삭제에 실패했습니다.");
            }
        }
    };

    //질문 수정 모드 활성화 함수
    const editComment = (id) => { 
        console.log(`${id}번 게시물 수정하기`);
        const editData = boardData.find((row) => row.id === id);  // 수정할 게시물 데이터 찾기

        if (editData) {
            setIWriter(editData.writer);
            setIContents(editData.contents);
            setEditId(id); 
        }
    };

    //새 질문 작성을 위해 모달을 열기 전 입력 필드를 초기화하는 함수
    const newOpenModal = () => {
        setIWriter('');
        setIContents('');
        setEditId(null); 
    };

    //페이지 번호 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="container mt-4 free-board-container">
                <BoardView  formatDisplayDate={formatDisplayDate}/>
                <CommentBtn newOpenModal={newOpenModal} />
                <ModalWindow
                    saveComment={saveComment}
                    iWriter={iWriter}
                    setIWriter={setIWriter}
                    iContents={iContents}
                    setIContents={setIContents}
                />
                <CommentList 
                    boardData={boardData} 
                    likePlus={likePlus} 
                    deleteComment={deleteComment} 
                    editComment={editComment}
                    currentPage={currentPage} 
                    commentsPerPage={commentsPerPage}
                    formatDisplayDate={formatDisplayDate}
                />
                <Pagination
                    commentsPerPage={commentsPerPage}
                    totalComments={boardData.length} 
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </>
    );
};

export default QnA; 