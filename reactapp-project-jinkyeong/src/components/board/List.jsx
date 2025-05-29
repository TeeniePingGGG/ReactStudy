import { Link } from "react-router-dom";

function List(props){
  const lists = props.boardData.map((row,idx)=>{
    return(
      <tr key={row.no}>
        <td className="cen">{row.no}</td>
        <td><Link to={`/free/view/${row.no}`}>{row.title}</Link></td>
        <td className="cen">{row.writer}</td>
        <td className="cen">{row.date}</td>
    </tr>
    );
  });

  return(<>
    <header>
      <h2 className="board-page-header">게시판 - 목록</h2>
    </header>
    <nav className="board-list-nav"> 
      <Link to="/free/write" className="write-btn">글쓰기</Link>
    </nav>
      <article>
        <table id="boardTable">
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>작성자</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {lists}
          </tbody>
        </table>
      </article>
  </>);
}

export default List;