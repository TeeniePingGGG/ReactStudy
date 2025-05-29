import { useState } from "react";

function BoardView(props) {
  return (
    <>
      {/* 게시판 열람 */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">댓글 작성 구현하기</h5>
          <p className="card-text">
            구현할 기능은 댓글작성, 좋아요, 수정, 삭제입니다.
            기능 구현은 아래 댓글 작성부터 하면 됩니다.
          </p>
        </div>
      </div>
    </>
  );
}

const CommentBtn = ({ onClick }) => {
  return (
    <button
      className="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#commentModal"
      onClick={onClick}
    >
      댓글 작성
    </button>
  );
};

function ModalWindow(props) {
  return (
    <>

    <form onSubmit={(event)=>{
      event.preventDefault();

      let writer = event.target.writer.value;
      let contents = event.target.contents.value;

      props.writeAction(writer, contents);

    }}>
    
    {/* 댓글 작성 Modal */}
    <div className="modal fade" id="commentModal" tabindex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="commentModalLabel">댓글 작성</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {/* 작성자명 입력상자 추가 */}
                    <div className="mb-3">
                        <label for="commentAuthor" class="form-label">작성자명</label>
                        <input type="text" class="form-control" id="commentAuthor" name="writer" placeholder="이름을 입력하세요" />
                    </div>
                    {/* 댓글 입력 상자 */}
                    <label for="commentContent" class="form-label">댓글 내용</label>
                    <textarea class="form-control" name="contents" id="commentContent" rows="3" placeholder="댓글을 입력하세요"></textarea>
                </div>
                <div className="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                    <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">작성</button>
                </div>
            </div>
        </div>
    </div>
  </form>
    </>
  ); 
}

function CommentList({ boardData, onLike, onDel }) {
  return (
    <ul className="list-group mt-3">
      {boardData.map((comment) => (
        <li className="list-group-item" key={comment.no}>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <strong>{comment.writer}</strong>{" "}
              <small className="ms-2">{comment.date}</small>
            </div>
            <div>
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => onLike(comment.no)}
              >
                좋아요 ({comment.likes || 0})
              </button>&nbsp;
              <button class="btn btn-outline-warning btn-sm"
              onClick={()=> onEdit(comment.no)}>수정</button>&nbsp;
              <button class="btn btn-outline-danger btn-sm"
              onClick={()=> onDel(comment.no)}>삭제</button>
            </div>
          </div>
          <p className="mt-2 mb-0">{comment.contents}</p>
        </li>
      ))}
    </ul>
  );
}

function App() {
  const [boardData, setBoardData] = useState([
    { no: 1, writer: '낙자쌤', date: '2023-01-01', contents: 'React를 뽀개봅시당' }
  ]);

  const [nextNo, setNextNo] = useState(2);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);


  const increaseLike = (commentNo) => {
    const updated = boardData.map((row) =>
      row.no === commentNo ? { ...row, likes: (row.likes || 0) + 1 } : row
    );
    setBoardData(updated);
  };


  const delContents = (commentNo) => {
    alert('삭제할까용?');
    const newBoardData = boardData.filter(row => row.no !== commentNo);
    setBoardData(newBoardData);
  };

  const editContents = (commentNo) => {
    const target = boardData.find((row) => row.no === commentNo);
    setEditTarget(target);
    setIsEditModalOpen(true);
  };

  
  return (
    <div className="container mt-4">
      <BoardView />
      
      <CommentBtn />  {/* 댓글 작성 버튼 */}
      
      <CommentList boardData={boardData} onLike={increaseLike} 
      onEdit={editContents} onDel={delContents} />

      {/* 댓글 작성 모달 항상 렌더링 */}
      <ModalWindow
        writeAction={(writer, contents) => {
          const dateObj = new Date();
          const year = dateObj.getFullYear();
          const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
          const day = ("0" + dateObj.getDate()).slice(-2);
          const nowDate = `${year}-${month}-${day}`;

          const newComment = {
            no: nextNo,
            writer,
            contents,
            date: nowDate
          };

          setBoardData([...boardData, newComment]);
          setNextNo(nextNo + 1);

        }}
      />

    </div>
  );
}


export default App
