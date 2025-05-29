// src/components/board/Write.js
import { Link } from "react-router-dom";

function Write(props){

  const boardData = props.boardData;
  const setBoardData = props.setBoardData;
  const nextNo = props.nextNo;
  const setNextNo = props.setNextNo;
  const navigate = props.navigate;
  const nowDate = props.nowDate;

  return(<>
    <header>
      <h2 className="board-page-header">게시판-작성</h2> 
  </header>
  <nav className="view-nav-buttons">
    <Link to="/free/list">목록</Link> 
  </nav>
  <article>
    <form onSubmit={(event)=>{
      event.preventDefault();

      let w = event.target.writer.value;
      let t = event.target.title.value;
      let c = event.target.contents.value;

      if(t=='' || w=='' || c==''){
          alert('다 입력해주세용');
          return;
        }

      let addBoardDate ={no:nextNo, writer:w, title:t,
        contents:c, date:nowDate()
      };

      let copyBoardData = [...boardData];
      copyBoardData.push(addBoardDate);
      setBoardData(copyBoardData);
      setNextNo(nextNo+1);
      navigate("/free/list"); 
    }} className="write-form">
      <table id="boardTable"> 
        <tbody>
          <tr>
            <th>작성자</th>
            <td><input type="text" name="writer"/></td>
          </tr>
          <tr>
            <th>제목</th>
            <td><input type="text" name="title"/></td>
          </tr>
          <tr>
            <th>내용</th>
            <td><textarea name="contents" cols="22" rows="3"></textarea></td>
          </tr>
        </tbody>
      </table>
      <input type="submit" value="전송"/>
    </form>
   </article>
  </>);
}

export default Write;