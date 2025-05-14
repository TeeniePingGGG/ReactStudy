
//매개변수 props를 통해 전달된 값(타이틀)을 출력
function Header(props){
  console.log('props',props.title);
  return(
    <header>
      <h2>{props.title}</h2>  
    </header>

  )
}
  function Nav(props){
    return(
      <nav>
        <a href="/" onClick={function(event){
          /* a태그는 화면의 깜빡임이 있으므로 이벤트를 차단 */
          event.preventDefault();
          //부모에서 전달된 함수를 호출
          props.onChangeMode();
        }}>글쓰기</a>
      </nav>
    )
  }

  function Article(props){
    //목록 생성을 위한 빈 배열
    const lists = [];
    //프롭스로 전달된 객체형 배열의 크기만큼 반복
    for(let i=0; i<props.boardData.length; i++){
      //각 루프에 해당하는 객체를 꺼낸 후 lists에 추가한다.
      let row = props.boardData[i];
      lists.push(
        //중복되지 않는 key prop은 게시물의 일련번호로 설정
        <tr key={row.no}>
          <td className="cen">{row.no}</td>
          {/* 제목을 클릭하면 열람으로 전환하기 위한 링크 생성. */}
          <td><a href={'/read/'+row.no} onClick={(event)=>{
            event.preventDefault();
            //각 게시물의 일련번호를 인수로 전달(화면전환도 같이 처리됨)
            props.onChangeMode(row.no);
          }}>{row.title}</a></td>
          <td className="cen">{row.wirter}</td>
          <td className="cen">{row.date}</td>
        </tr>
      );
    }
    return(
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
            {/* 배열에 추가한 데이터를 이 부분에 출력 */}
              {lists}
          </tbody>
        </table>
      </article>
    )
  }

  function App(){
    //게시판의 데이터로 사용할 객체형 배열
    const boardData=[
      {no:1, title:'오늘은 React 공부 하는 날', wirter:'낙자쌤', date:'2023-01-01',
        contents:'React를 뽀개봅시당'
      },
      {no:2, title:'어제는 JavaScript 공부해씸', wirter:'유겸이', date:'2023-03-03',
        contents:'JavaScript는 할게 너무 많아요'
      },
      {no:3, title:'내일은 Project 해야징', wirter:'개똥이', date:'2023-05-05',
        contents:'Project는 뭘 만들어볼까?'
      }
    ]
    return(
      <div className="App">
        {/* 문자열은 '을 통해 프롭스를 전달한다. */}
        <Header title="게시판 - 목록(props)"></Header> 
        {/* Nav 컴포넌트는 매개변수가 없는 함수를 프롭스로 전달 */}
        <Nav onChangeMode={function(){
          alert("글쓰기 페이지로 이동")
        }}></Nav>
        {/* 변수는 중괄호를 사용한다.  */}
        {/* 게시물의 일련번호를 전달해야 하므로, 매개변수가 있는 함수를 프롭스로
        전달한다.  */}
        <Article boardData={boardData} onChangeMode={(no)=>{
          alert('선택한 게시물 번호:'+no);
        }}></Article>
      </div>
    );
  }

export default App;
