//스테이트 사용을 위한 훅 임포트 
import { useState } from "react";

//페이지가 없을때 임시로 사용하기 위한 컴포넌트
function ReadyComp(){
  return(
    <div>
      <h3>컴포넌트 준비중입니다</h3>
      <a href="/">HOME 바로가기</a>
    </div>
  );
}

//매개변수 props를 통해 전달된 값(타이틀)을 출력
//헤더 컴포넌트는 모든 페이지에서 공통으로 사용된다.
function Header(props){
  console.log('props',props.title);
  return(
    <header>
      <h2>{props.title}</h2>  
    </header>

  )
}
//목록에서 사용할 네비게이션
  function NavList(props){
    return(
      // 엘리먼트 사이를 띄어쓰기 할때는 &nbsp; 를 사용하면 된다.
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

  //열람의 네비게이션 
  function NavView(props){
    return(
      <nav>
        <a href="/" onClick={function(event){
          event.preventDefault();
          props.onChangeMode('list');
        }}>목록</a>&nbsp;
        <a href="/" onClick={function(event){
          event.preventDefault();
          props.onChangeMode('edit');
        }}>수정</a>
        <a href="/" onClick={function(event){
          event.preventDefault();
          props.onChangeMode('delete');
        }}>삭제</a>
      </nav>
    )
  }

  //쓰기의 네비게이션
  function NavWrite(props){
    return(
      <nav>
        <a href="/" onClick={function(event){
          event.preventDefault();
          props.onChangeMode();
        }}>목록</a>
      </nav>
    )
  }

  //목록 
  function ArticleList(props){
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

  //열람
  function ArticleView(props){
    return(
      <article>
        <table id="boardTable">
          <colgroup>
            <col width="20%" /><col width="*"/>
          </colgroup>
          <tbody>
            <tr>
              <th>작성자</th>
              <td>성유겸</td>
            </tr>
            <tr>
              <th>제목</th>
              <td>오늘은 React 공부 하는 날</td>
            </tr>
            <tr>
              <th>날짜</th>
              <td>2023-05-05</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>열심히 해봅시다<br />열공합시당</td>
            </tr>
          </tbody>
        </table>
      </article>

    );
  }

  //작성
  function ArticleWrite(props){
    return(
      <article>
        <form>
        <table id="boardTable">
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
            <td><textarea name="contents" rows="3"></textarea></td>
          </tr>
        </table>
        <input type="submit" value="전송" />
        </form>
      </article>
    );
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
    ];

    /* 화면 전환을 위한 스테이트 생성. 변수명은 mode, 초깃값은 list,
    변경을 위한 함수는 setMode()로 정의한다.  */
    const [mode,setMode]=useState('list');

    //컴포넌트와 타이틀을 저장할 변수 생성
    let articleComp, navComp, titleVar;

    //mode의 값에 따라 각 화면을 전환하기 위해 분기한다.
    if(mode==='list'){
      titleVar ='게시판 - 목록(props)';
      navComp=<NavList onChangeMode={()=>{
          setMode('write');
      }}></NavList>
      articleComp = <ArticleList boardData ={boardData}
        onChangeMode={(no)=>{
          console.log('선택한 게시물 번호:'+no);
          setMode('view');
        }}>

      </ArticleList>
    }
    else if(mode=='view'){
      titleVar='게시판-읽기(props)';
      navComp=<NavView onChangeMode={(pmode)=>{
        setMode(pmode);
      }}></NavView>
      articleComp=<ArticleView></ArticleView>
    }
    else if(mode=='write'){
      titleVar='게시판-쓰기(props)';
      navComp=<NavWrite onChangeMode={(pmode)=>{
        setMode(pmode);
      }}></NavWrite>
      articleComp=<ArticleWrite></ArticleWrite>;

    }
    else{
      //mode의 값이 없는 경우 '준비중'을 화면에 표시한다.
      navComp =<ReadyComp></ReadyComp>;
      articleComp='';
    }
    return(
      <div className="App">
        {/* 문자열은 '을 통해 프롭스를 전달한다. */}
        <Header title="게시판 - 목록(props)"></Header> 
        {/* mode의 변화에 따라 다른 컴포넌트를 렌더링한다.  */}
        {navComp}
        {articleComp}
      </div>
    );
  }

export default App;
