import { useState } from "react";

function BoardView() {
  return (
    <>
      {/* 게시판 열람 */}
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
      {/* 게시판 글 작성 버튼 */}
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

function ModalWindow(props) {
  return (
    <>
      {/* 게시판 글 작성 Modal */}
      <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="commentModalLabel">Q&A</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* 작성자명 입력 상자 */}
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
              {/* 글 내용 입력 상자*/}
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

function CommentList(props) {
  // 날짜 형식을 변경하는 헬퍼 함수
  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 현재 페이지에 해당하는 댓글만 필터링
  const startIndex = (props.currentPage - 1) * props.commentsPerPage;
  const endIndex = startIndex + props.commentsPerPage;
  const currentComments = props.boardData.slice(startIndex, endIndex);

  return (
    <>
      {currentComments.map((row) => { // 필터링된 댓글만 맵핑
        return (
          <ul className="list-group mt-3 comment-list" key={row.idx}> 
            <li className="list-group-item comment-list-item">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <strong className="comment-writer">{row.writer}</strong>{" "}
                  <small className="ms-2 comment-date">{formatDateTime(row.postdate)}</small>
                </div>
                <div>
                  <button className="btn btn-outline-success btn-sm comment-action-btn like-btn" onClick={() => props.likePlus(row.idx)}>
                    좋아요 ({row.likes})
                  </button>&nbsp;
                  <button className="btn btn-outline-warning btn-sm comment-action-btn edit-btn" data-bs-toggle="modal" data-bs-target="#commentModal" onClick={() => props.editComment(row.idx)}>
                    수정
                  </button>&nbsp;
                  <button className="btn btn-outline-danger btn-sm comment-action-btn delete-btn" onClick={() => props.deleteComment(row.idx)}>
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

// 페이징 컴포넌트
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


const Free = () => {
  const [boardData, setBoardData] = useState([
    { idx: 1, writer: '낙자쌤', postdate: '2025-05-27T10:30:00.000Z', contents: 'React 넘 어려웡~', likes: 0 },
    { idx: 2, writer: '동동수', postdate: '2025-05-27T11:00:00.000Z', contents: '킷캣 아이스 그린티가 짱인가요?', likes: 5 },
    { idx: 3, writer: '봄날의 햇살 선우', postdate: '2025-05-27T11:15:00.000Z', contents: '체리쥬빌레에서 쥬빌레는 무슨 뜻인가요?', likes: 2 },
    { idx: 4, writer: '퀸영진', postdate: '2025-05-27T11:45:00.000Z', contents: '왜 허브맛 아이스크림을 만들었나요??', likes: 10 },
    { idx: 5, writer: '박천개빡천', postdate: '2025-05-27T12:00:00.000Z', contents: '박천은 개빡천인가요??', likes: 0 },
    { idx: 6, writer: '개강하니', postdate: '2025-05-28T09:30:00.000Z', contents: '초코나무숲은 왜 이름이 초코나무숲인가요?', likes: 3 },
    { idx: 7, writer: '이글이글이글', postdate: '2025-05-28T09:30:00.000Z', contents: '이글아 반갑다아', likes: 30 },
  ]);
  
  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [commentsPerPage] = useState(3); // 페이지당 댓글 수

  //입력상자
  const [iWriter, setIWriter] = useState('');
  const [iContents, setIContents] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  //시퀀스
  const [nextVal, setNextVal] = useState(7); // 초기 데이터 6개이므로 7부터 시작

  // **Helper 함수: 데이터를 날짜(최신순)으로 정렬**
  const sortBoardData = (data) => {
    // 원본 배열 복사 후 정렬
    return [...data].sort((a, b) => new Date(b.postdate) - new Date(a.postdate));
  };


  //댓글 작성 및 수정
  const saveComment = () => {
    if (iWriter.trim() === '' || iContents.trim() === '') {
      alert('작성자와 내용을 모두 입력해주세요!');
      return;
    }

    let updatedBoardData;
    if (editIdx === null) {
      // 댓글 작성
      const sysdate = new Date().toISOString(); 
      const newData = {
        idx: nextVal,
        writer: iWriter,
        postdate: sysdate, // ISOString으로 저장
        contents: iContents,
        likes: 0,
      };
      updatedBoardData = [...boardData, newData];
      setNextVal(nextVal + 1);
    } else {
      //댓글 수정
      updatedBoardData = boardData.map((row) => {
        return row.idx === editIdx ? { ...row, writer: iWriter, contents: iContents } : row;
      });
    }

    // ★ 데이터 정렬 후 상태 업데이트
    setBoardData(sortBoardData(updatedBoardData));
    setCurrentPage(1); // 새 댓글/수정 후 1페이지로 이동

    setIWriter('');
    setIContents('');
    setEditIdx(null); // 수정 완료 후 editIdx 초기화
  };

  //좋아요
  const likePlus = (idx) => {
    const newData = boardData.map((row) => {
      return row.idx === idx ? { ...row, likes: row.likes + 1 } : row;
    });
    setBoardData(sortBoardData(newData)); // ★ 정렬 후 상태 업데이트
  };

  //댓글삭제
  const deleteComment = (idx) => {
    if (window.confirm('댓글을 삭제할까요?')) {
      const newData = boardData.filter((row) => {
        return row.idx !== idx;
      });
      
      // ★ 정렬 후 상태 업데이트
      setBoardData(sortBoardData(newData));

      // 댓글 삭제 후 현재 페이지가 유효한지 확인
      const totalPages = Math.ceil(newData.length / commentsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (newData.length === 0) {
        setCurrentPage(1);
      }
    }
  };

  //댓글수정
  const editComment = (idx) => {
    console.log(`${idx}번 게시물 수정하기`);
    const editData = boardData.find((row) => row.idx === idx);
    if (editData) {
      setIWriter(editData.writer);
      setIContents(editData.contents);
      setEditIdx(idx);
    }
  };

  //댓글 작성을 위해 모달창을 열면 입력폼 초기화
  const newOpenModal = () => {
    setIWriter('');
    setIContents('');
    setEditIdx(null); // 초기화 시 editIdx도 null로
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
          boardData={sortBoardData(boardData)} 
          likePlus={likePlus} 
          deleteComment={deleteComment} 
          editComment={editComment}
          currentPage={currentPage} 
          commentsPerPage={commentsPerPage}
        />
        <Pagination
          commentsPerPage={commentsPerPage}
          totalComments={boardData.length} // 총 댓글 수는 정렬 전후 동일
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </>
  );
};

export default Free;