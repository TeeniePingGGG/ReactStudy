//스테이트 사용을 위한 훅 임포트 
import { useState } from "react";

//모듈화 한 컴포넌트 임포트
import NavList from "./components/navigation/NavList";
import NavView from "./components/navigation/NavView";
import NavWrite from "./components/navigation/NavWrite";  
import ArticleList from "./components/article/ArticleList"; 
import ArticleView from "./components/article/ArticleView";
import ArticleWrite from "./components/article/ArticleWrite";

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

  function App(){
    //게시판의 데이터로 사용할 객체형 배열
    const boardData=[
      {no:1, title:'오늘은 React 공부 하는 날', writer:'낙자쌤', date:'2023-01-01',
        contents:'React를 뽀개봅시당'
      },
      {no:2, title:'어제는 JavaScript 공부해씸', writer:'유겸이', date:'2023-03-03',
        contents:'JavaScript는 할게 너무 많아요'
      },
      {no:3, title:'내일은 Project 해야징', writer:'개똥이', date:'2023-05-05',
        contents:'Project는 뭘 만들어볼까?'
      }
    ];

    /* 화면 전환을 위한 스테이트 생성. 변수명은 mode, 초깃값은 list,
    변경을 위한 함수는 setMode()로 정의한다.  */
    const [mode,setMode]=useState('list');

    //선택한 게시물의 일련번호를 저장. 첫 실행시에는 선택한 게시물이 없으므로 null로 초기화
    const [no,setNo] = useState(null);

    //컴포넌트와 타이틀을 저장할 변수 생성
    //선택할 게시물의 객체를 저장할 변수 추가( "{no:1, title:'오늘은" 와 같은 객체를 저장})
    let articleComp, navComp, titleVar, selectRow;

    //mode의 값에 따라 각 화면을 전환하기 위해 분기한다.
    if(mode==='list'){
      titleVar ='게시판 - 목록(props)';
      navComp=<NavList onChangeMode={()=>{
          setMode('write');
      }}></NavList>
      articleComp = <ArticleList boardData ={boardData}
        onChangeMode={(no)=>{
          console.log('선택한 게시물 번호:'+no);
          //화면을 '열람'으로 전환
          setMode('view');
          //선택한 게시물의 일련번호로 스테이트 변경
          setNo(no);
        }}>

      </ArticleList>
    }
    else if(mode=='view'){
      titleVar='게시판-읽기(props)';
      navComp=<NavView onChangeMode={(pmode)=>{
        setMode(pmode);
      }}></NavView>
       
      console.log('현재no',no,typeof(no));
      //선택한 게시물의 일련번호와 일치하는 객체를 검색하기 위해 반복
      for(let i=0; i<boardData.length; i++){
        if(no==boardData[i].no){
          //일치하는 게시물이 있다면 변수에 저장
          selectRow = boardData[i];
        }
      }
      //선택한 게시물을 프롭스를 통해 자식 컴포넌트로 전달          
      articleComp=<ArticleView selectRow={selectRow}></ArticleView>
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
