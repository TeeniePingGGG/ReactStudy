import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function View(props){
  //중첩된 라우팅에서 일련번호를 읽어오기 위한 훅
  let params = useParams();
  console.log('idx',params.idx);  

  //열람 API는 JSON 객체이므로 빈 객체를 초기값으로 지정
  let [boardData, setBoardData] = useState({});
  //API 요청 주소
  let requestUrl = "http://nakja.co.kr/APIs/php7/boardViewJSON.php";
  //파라미터(쿼리스트링)
  let parameter = "tname=nboard_news&idx="+params.idx+"&apikey=7bc404b517fb8b976b36ca028985577b";

  //1차 렌더링 후 열람 API요청
  useEffect(function(){
    fetch(requestUrl+"?"+parameter)
    .then((result)=>{
      return result.json();
    })
    .then((json)=>{
      console.log(json);
      //스테이트 변경 및 리렌더링
      setBoardData(json);
    });

    return()=>{
      console.log('useEffect실행==> 컴포넌트 언마운트');
    }
  },[]);

  return(<>
    <header>
      <h2>게시판-읽기</h2>
  </header>
  <nav>
    <Link to="/list">목록</Link>&nbsp;
    <Link to={"/edit/"+params.idx}>수정</Link>&nbsp;
    <Link to="/delete">삭제</Link>&nbsp;
  </nav>
  <article>
    <table id="boardTable">
      <colgroup>
        <col width="30%"/><col width="*"/>
      </colgroup>
      <tbody>
        <tr>
          <th>작성자</th>
          {/* 내용 출력은 JSON객체이므로 각 key를 통해 접근하면 된다. */}
          <td>{boardData.name}</td>
        </tr>
        <tr>
          <th>제목</th>
          <td>{boardData.subject}</td>
        </tr>
        <tr>
          <th>날짜</th>
          <td>{boardData.regdate}</td>
        </tr>
        <tr>
          <th>내용</th>
          {/* 마크업이 적용된 상태로 출력된다. */}
          <td dangerouslySetInnerHTML={{__html: boardData.content}}></td>

          {/* HTML 태그가 그대로 출력된다. React는 보안적인 문제로
          태그를 화면에 그대로 출력하는 것이 디폴트 설정이다. */}
          {/* <td>{boardData.content}</td> */}
        </tr>
      </tbody>
    </table>
  </article>
  </>);
}

  export default View;