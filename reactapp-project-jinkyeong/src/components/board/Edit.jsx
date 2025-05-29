// src/components/board/Edit.jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

function Edit(props) {
  const boardData = props.boardData;
  const setBoardData = props.setBoardData;
  const navigate = props.navigate;
  const nowDate = props.nowDate;

  var params = useParams();
  let pno = Number(params.no);

  let vi = boardData.reduce((prev, curr) => {
    if (curr.no === pno) {
      prev = curr;
    }
    return prev;
  }, {});

  // 게시물을 찾지 못했을 때의 처리 (예: 목록으로 리다이렉트 또는 에러 메시지 표시)
  // vi가 undefined일 수 있으므로 초기값 설정에 주의
  // 여기서는 useNavigate를 사용하여 리다이렉트하는 것이 좋습니다.
  // 이 부분은 컴포넌트 렌더링 전에 처리해야 합니다.
  // 예를 들어, useEffect를 사용하여 게시물이 없는 경우를 처리할 수 있습니다.
  // 아니면 vi.title || '' 와 같이 기본값을 두어 에러 방지

  // 게시물 데이터를 찾지 못했을 경우 초기화 혹은 리다이렉트
  if (!vi || Object.keys(vi).length === 0) {
      // 해당 게시물이 없으면 목록으로 리다이렉트 (선택 사항)
      // useEffect 훅 내에서 처리하는 것이 더 안전할 수 있습니다 (무한 루프 방지)
      // 또는 단순히 빈 폼을 보여주거나, "게시물을 찾을 수 없습니다" 메시지를 표시할 수 있습니다.
      // 여기서는 일단 기본값으로 처리합니다.
      // navigate("/free/list"); // 즉시 리다이렉트하면 useState 초기화 전에 발생할 수 있음
      // return <div>게시물을 찾을 수 없습니다.</div>; // 메시지 표시
  }


  const [title, setTitle] = useState(vi.title || '');
  const [writer, setWriter] = useState(vi.writer || '');
  const [contents, setContents] = useState(vi.contents || '');

  return (
    <>
      {/* ⭐ 클래스 적용 ⭐ */}
      <header>
          <h2 className="edit-page-header">게시판 수정</h2>
      </header>
      {/* ⭐ 클래스 적용 ⭐ */}
      <nav className="edit-nav-buttons">
        <Link to="/free/list">목록</Link>
      </nav>

      {/* ⭐ 클래스 적용 ⭐ */}
      <article className="edit-form-article">
        <form onSubmit={(event) => {
          event.preventDefault();

          let w = event.target.writer.value;
          let t = event.target.title.value;
          let c = event.target.contents.value;

          if(t==='' || w==='' || c===''){
              alert('모든 필드를 입력해주세요.');
              return;
            }

          let editedBoardData = {
            no: pno,
            writer: w,
            title: t,
            contents: c,
            date: nowDate()
          };

          let copyBoardData = [...boardData];
          for (let i = 0; i < copyBoardData.length; i++) {
            if (copyBoardData[i].no === pno) {
              copyBoardData[i] = editedBoardData;
              break;
            }
          }

          setBoardData(copyBoardData);
          navigate(`/free/view/${pno}`);
        }}>

          {/* ⭐ id는 이미 boardTable로 전역 css에 있지만, 명확성을 위해 클래스도 추가할 수 있습니다. ⭐ */}
          <table id="boardTable"> {/* 기존 id 유지 */}
            <tbody>
              <tr>
                <th>작성자</th>
                <td>
                  <input
                    type="text"
                    name="writer"
                    value={writer}
                    onChange={(event) => {
                      setWriter(event.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>제목</th>
                <td>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>내용</th>
                <td>
                  <textarea
                    name="contents"
                    rows='3'
                    value={contents}
                    onChange={(event) => {
                      setContents(event.target.value);
                    }}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
          <input type="submit" value="수정 완료" />
        </form>
      </article>

    </>
  );
}

export default Edit;