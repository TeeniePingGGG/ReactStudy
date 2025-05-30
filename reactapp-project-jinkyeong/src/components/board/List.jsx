import { Link } from "react-router-dom";

function List(props){
  const formatDisplayDate = props.formatDisplayDate;
  return(<>
    <header>
      <h2 className="board-page-header">자유 게시판</h2>
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
          {props.boardData.map((row) => {
            return(
              
              <tr key={row.id}> 
                <td className="cen">{row.no}</td>
                <td><Link to={`/free/view/${row.id}`}>{row.title}</Link></td> 
                <td className="cen">{row.writer}</td>
                <td className="cen">{formatDisplayDate(row.date)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </article>
  </>);
}

export default List;