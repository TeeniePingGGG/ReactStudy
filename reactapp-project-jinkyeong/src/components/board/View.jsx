// src/components/board/View.js
import { Link, useParams } from "react-router-dom";

function View(props){
  var params = useParams();
  console.log('파라미터',params.no);

  let vi = props.boardData.reduce((prev,curr)=>{
    if(curr.no==Number(params.no)){
      prev=curr;
    }
    return prev;
  },{});

  return(<>
    <header>
      <h2 className="board-page-header">게시판-읽기</h2>
  </header>
  <nav className="view-nav-buttons">
    <Link to="/free/list">목록</Link>&nbsp;
    <Link to={`/free/edit/${vi.no}`}>수정</Link>&nbsp;
    {/* ⭐ 이 부분을 다음과 같이 수정합니다. ⭐ */}
    <Link to={`/free/del/${vi.no}`}>삭제</Link>&nbsp; {/* 삭제 링크 연결 */}
  </nav>
  <article>
    <table className="view-table">
      <colgroup>
        <col width="30%"/><col width="*"/>
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
          <td>{vi.date}</td>
        </tr>
        <tr>
          <th>내용</th>
          <td>{vi.contents}</td>
        </tr>
      </tbody>
    </table>
  </article>
  </>);
}

export default View;