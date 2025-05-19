import { Link, useNavigate } from "react-router-dom";

function Write(props){
  //페이지 이동을 위한 훅 사용
  const navigate = useNavigate();
  return(<>
    <header>
      <h2>게시판-작성</h2>
  </header>
  <nav>
    <Link to="/list">목록</Link>
  </nav>
  <article>
  <form onSubmit={
    (event) => {
      event.preventDefault();

      let w = event.target.writer.value;
      let t = event.target.title.value;
      let c = event.target.contents.value;
      console.log(w, t, c);

      // 작성 API 호출
      /* fetch 함수를 통해 post반식으로 요청을 해야하는 경우 
      두번쨰 인수가 필요하다 */
      fetch("http://nakja.co.kr/APIs/php7/boardWriteJSON.php", {
        //1. 전송방식 설정
        method: 'POST',
        //2.헤더 설정(컨텐츠타입, 케릭터셋)
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        /*
        3. 작성자가 입력한 폼값을 JSON형식으로 조립하여 전송한다.
        URLSearchPramas 객체는 JSON형식의 데이터를 쿼리스트링 형식으로
        변환해준다.
        */
        body: new URLSearchParams({
          tname: 'nboard_news',
          id: 'jsonAPI',
          name: w,
          subject: t,
          content: c,
          apikey: '7bc404b517fb8b976b36ca028985577b',
        }),
      })
        .then((response) => response.json())
        .then((json) => console.log(json));

      //글쓰기가 완료되면 목록으로 이동한다.
      navigate("/list");
    }
  }>
    <table id="boardTable">
      <tbody>
        <tr>
          <th>작성자</th>
          <td><input type="text" name="writer" /></td>
        </tr>
        <tr>
          <th>제목</th>
          <td><input type="text" name="title" /></td>
        </tr>
        <tr>
          <th>내용</th>
          <td><textarea name="contents" cols="22" rows="3"></textarea></td>
        </tr>
      </tbody>
    </table>
    <input type="submit" value="전송" />
  </form>
</article>

  </>);
}

  export default Write;