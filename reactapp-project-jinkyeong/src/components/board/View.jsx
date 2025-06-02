import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { firestore } from '../../firestoreConfig'; // firestore 객체 임포트

// 파일 이름의 확장자를 확인하여 이미지 파일인지 여부를 판단하는 함수
const isImageFile = (filename) => {
    if (!filename || typeof filename !== 'string') {
        return false;
    }
    // 파일 이름에서 확장자를 추출하여 소문자로 변환
    const ext = filename.split('.').pop().toLowerCase();
    // 이미지 파일 확장자 목록에 포함되는지 확인
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'jfif'].includes(ext);
};

// 게시물 날짜를 화면에 표시하기 적절한 형식으로 변환하는 함수(오늘 날짜는 시간까지, 아니면 년 월 일만 표시)
const formatDisplayDate = (postDateString) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    if (!postDateString || typeof postDateString !== 'string') {
        console.warn("formatDisplayDate: Invalid postDateString provided:", postDateString);
        return "";
    }

    // 년 월 일 정보 추출(정규식 사용)
    const yearMatch = postDateString.match(/(\d{4})년/);
    const monthMatch = postDateString.match(/(\d{2})월/);
    const dayMatch = postDateString.match(/(\d{2})일/);

    if (!yearMatch || !monthMatch || !dayMatch) {
        // 날짜 형식이 일치하지 않을 경우 처리
        try {
            const date = new Date(postDateString);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
            }
        } catch (e) {
            console.error("Failed to parse date string for display:", postDateString, e);
        }
        return postDateString; // 파싱 실패 시 원본 문자열 반환
    }

    const postYear = parseInt(yearMatch[1], 10);
    const postMonth = parseInt(monthMatch[1], 10);
    const postDay = parseInt(dayMatch[1], 10);

    if (postYear === currentYear && postMonth === currentMonth && postDay === currentDay) {
        return postDateString;
    } else {
        return `${postYear}년 ${monthMatch[0]} ${dayMatch[0]}`;
    }
};

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

// 댓글 작성 버튼 컴포넌트
const CommentBtn = (props) => {
    return (
        <>
            <button
                className="btn btn-primary comment-write-btn"
                data-bs-toggle="modal"
                data-bs-target="#commentModal"
                onClick={() => props.newOpenModal()}
            >
                댓글 달기
            </button>
        </>
    );
};

// 댓글 작성 및 수정 모달 컴포넌트
function ModalWindow(props) {
    return (
        <>
            <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="commentModalLabel">댓글</h5>
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
                            <label htmlFor="commentContent" className="form-label">댓글</label>
                            <textarea
                                className="form-control"
                                id="commentContent"
                                rows="3"
                                placeholder="댓글 내용을 입력하세요"
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

// 댓글 목록을 렌더링하는 컴포넌트
function CommentList(props) {
    return (
        <>
            {props.comments.map((comment) => (
                <ul className="list-group mt-3 comment-list" key={comment.id}>
                    <li className="list-group-item comment-list-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <strong className="comment-writer">{comment.writer}</strong>{" "}
                                <small className="ms-2 comment-date">{props.formatDisplayDate(comment.postdate)}</small>
                            </div>
                            <div>
                                <button className="btn btn-outline-warning btn-sm comment-action-btn edit-btn" data-bs-toggle="modal" data-bs-target="#commentModal" onClick={() => props.editComment(comment.id)}>
                                    수정
                                </button>&nbsp;
                                <button className="btn btn-outline-danger btn-sm comment-action-btn delete-btn" onClick={() => props.deleteComment(comment.id)}>
                                    삭제
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 mb-0 comment-contents">
                            {comment.contents}
                        </p>
                    </li>
                </ul>
            ))}
        </>
    );
}

// 게시물 상세 내용을 표시하는 컴포넌트
function View(props) {
    const { id } = useParams();
    const { boardData } = props; // props에서 boardData를 받습니다.

    const [comments, setComments] = useState([]); // 댓글 데이터를 저장
    const [iWriter, setIWriter] = useState('');
    const [iContents, setIContents] = useState('');
    const [editCommentId, setEditCommentId] = useState(null); // 수정 중인 댓글 ID

    const vi = boardData.find(item => item.id === id);

    useEffect(() => {
        if (id) {
            const commentsCollectionRef = collection(firestore, `board/${id}/comments`);
            const q = query(commentsCollectionRef, orderBy('postdate', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedComments = [];
                snapshot.forEach((doc) => {
                    fetchedComments.push({ id: doc.id, ...doc.data() });
                });
                setComments(fetchedComments);
            }, (error) => {
                console.error("댓글 데이터 로드 오류:", error);
            });
            return () => unsubscribe();
        }
    }, [id]);

    // 댓글 저장 (추가 및 수정)
    const saveComment = async () => {
        if (iWriter.trim() === '' || iContents.trim() === '') {
            alert('작성자와 내용을 모두 입력해주세요!');
            return;
        }

        try {
            const commentsCollectionRef = collection(firestore, `board/${id}/comments`);
            if (editCommentId === null) {
                // 새 댓글 추가
                await addDoc(commentsCollectionRef, {
                    writer: iWriter,
                    postdate: nowDate(),
                    contents: iContents,
                });
                alert('댓글이 작성되었습니다!');
            } else {
                // 기존 댓글 수정
                const commentDocRef = doc(firestore, `board/${id}/comments`, editCommentId);
                await updateDoc(commentDocRef, {
                    writer: iWriter,
                    contents: iContents,
                });
                alert('댓글이 수정되었습니다!');
            }
        } catch (error) {
            console.error("댓글 작성/수정 실패:", error);
            alert("댓글 작성/수정에 실패했습니다. 다시 시도해주세요.");
        }

        setIWriter('');
        setIContents('');
        setEditCommentId(null);
    };

    // 댓글 삭제
    const deleteComment = async (commentId) => {
        if (window.confirm('댓글을 삭제할까요?')) {
            try {
                const commentDocRef = doc(firestore, `board/${id}/comments`, commentId);
                await deleteDoc(commentDocRef);
                alert('댓글이 삭제되었습니다!');
            } catch (error) {
                console.error("댓글 삭제 실패:", error);
                alert("댓글 삭제에 실패했습니다.");
            }
        }
    };

    // 댓글 수정 모드 활성화
    const editComment = (commentId) => {
        const commentToEdit = comments.find((comment) => comment.id === commentId);
        if (commentToEdit) {
            setIWriter(commentToEdit.writer);
            setIContents(commentToEdit.contents);
            setEditCommentId(commentId);
        }
    };

    // 새 댓글 작성을 위해 모달을 열기 전 입력 필드를 초기화
    const newOpenModal = () => {
        setIWriter('');
        setIContents('');
        setEditCommentId(null);
    };

    if (!vi) {
        console.warn('View.js Debug: 게시물을 찾을 수 없습니다. 현재 boardData:', boardData);
        return <div>게시물을 찾을 수 없습니다. (게시물 ID: {id})</div>;
    }

    return (
        <>
            <header>
                <h2 className="board-page-header">게시판-읽기</h2>
            </header>
            <nav className="view-nav-buttons">
                <Link to="/free/list">목록</Link>&nbsp;
                <Link to={`/free/edit/${vi.id}`}>수정</Link>&nbsp;
                <Link to={`/free/del/${vi.id}`}>삭제</Link>&nbsp;
            </nav>
            <article>
                <table className="view-table">
                    <colgroup>
                        <col width="30%" /><col width="*" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>작성자</th>
                            <td>{vi.writer}</td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td>{vi.title}</td>
                        </tr>
                        <tr>
                            <th>날짜</th>
                            <td>{formatDisplayDate(vi.date)}</td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>{vi.contents}</td>
                        </tr>
                        {/* 첨부파일이 존재하고 dataUrl이 있을 경우에만 렌더링 */}
                        {vi.file && vi.file.dataUrl && (
                            <tr>
                                <th>첨부파일</th>
                                <td>
                                    {/* 이미지인 경우 */}
                                    {isImageFile(vi.file.name) ? (
                                        <img
                                            src={vi.file.dataUrl} // 이미지 소스
                                            alt={vi.file.name} //대체 텍스트
                                            style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd' }}
                                        />
                                    ) : (
                                        // 이미지가 아닌 경우
                                        <a href={vi.file.dataUrl} download={vi.file.name}>
                                            {vi.file.name} {/* 파일 이름 표시 */}
                                        </a>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </article>

            {/* 댓글 기능 추가 부분 */}
            <div className="comment-section mt-5">
                <h3>댓글</h3>
                <CommentBtn newOpenModal={newOpenModal} />
                <ModalWindow
                    saveComment={saveComment}
                    iWriter={iWriter}
                    setIWriter={setIWriter}
                    iContents={iContents}
                    setIContents={setIContents}
                />
                <CommentList
                    comments={comments}
                    deleteComment={deleteComment}
                    editComment={editComment}
                    formatDisplayDate={formatDisplayDate}
                />
            </div>
        </>
    );
}

export default View;