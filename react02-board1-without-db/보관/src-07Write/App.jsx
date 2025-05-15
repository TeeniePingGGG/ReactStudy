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
    /* 작성을 위해 기존의 객체형 배열을 스테이트로 변환한다. 데이터의 추가, 삭제가
    있을때 새로운 렌더링이 되어야하기 때문이다.  */
    const [boardData,setBoardData]=useState([
      {no:1, title:'오늘은 React 공부 하는 날', wirter:'낙자쌤', date:'2023-01-01',
        contents:'React를 뽀개봅시당'
      },
      {no:2, title:'어제는 JavaScript 공부해씸', wirter:'유겸이', date:'2023-03-03',
        contents:'JavaScript는 할게 너무 많아요'
      },
      {no:3, title:'내일은 Project 해야징', wirter:'개똥이', date:'2023-05-05',
        contents:'Project는 뭘 만들어볼까?'
      }
    ]);

    /* 화면 전환을 위한 스테이트 생성. 변수명은 mode, 초깃값은 list,
    변경을 위한 함수는 setMode()로 정의한다.  */
    const [mode,setMode]=useState('list');

    //선택한 게시물의 일련번호를 저장. 첫 실행시에는 선택한 게시물이 없으므로 null로 초기화
    const [no,setNo] = useState(null);

    //새로운 게시물 작성시 사용할 시퀀스(Sequence)용도의 스테이트 생성
    //이미 3개의 게시물이 있으므로 초기값은 4로 설정한다.                     
    const [nextNo, setNextNo] = useState(4);

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
      navComp=<NavWrite onChangeMode={()=>{
        setMode('list');
      }}></NavWrite>

      articleComp=<ArticleWrite writeAction={(t,w,c)=>{
        //3개의 값을 받을 수 있는 함수를 정의하여 프롭스로 전달
        console.log('App.js',t,w,c);

        if(t=='' || w=='' || c==''){
          alert('다 입력해주세용');
          return;
        }

        //작성일을 Date객체를 통해 생성
        let dateObj = new Date();
        //현재년도 
        var year = dateObj.getFullYear();
        //getMonth() : 0~11까지를 반환하므로 +1 해야 현재월을 구할 수 있다.
        var month = ("0"+(1+dateObj.getMonth())).slice(-2);
        /*
        월과 일이
          한자리인 경우에는 01과 같이 생성되고
          두자리인 경우에는 012와 같이 생성되므로 끝에 두자리만 잘라낸다.
          이떄 slice(-2)를 사용한다.
        */
       //0000-00-00 형식으로 날짜를 생성한다. 
        var day = ("0"+dateObj.getDate()).slice(-2);
        let nowDate = year+"-"+month+"-"+day;

        /* 스테이트 배열에 추가할 객체르 생성한다. 일련번호를 스테이트로 선언한
        nextNo를 사용하고, 작성폼에 입력한 값을 받아서 구성한다.  */
        let addBoardDate = {no:nextNo, title:t, wirter:w, contents:c, date:nowDate};

        //추가 방법 1(권장)
        //스프레드 연산자로 복사본 배열을 하나 생성한다.
        let copyBoardData = [...boardData];
        //복사된 배열에 새로운 객체를 추가한다.
        copyBoardData.push(addBoardDate);
        //복사된 배열을 통해 스테이트를 변경한다.
        setBoardData(copyBoardData);


        /*
        배열의 복사본을 만들면 메모리에는 새로운 배열이 하나 추가된다. 복사본에
        데이터를 추가한 후 이를 통해 State를 변경한다. 그러면 새롭게 생성된 배열의
        참조값을 통해  State를 변경했으므로 React는 변화를 감지하여 새로운 렌더링을
        하게 된다.
        JavaScript는 얕은 참조라는 개념을 통해 객체의 변화를 감지하도록 설계되어 있어
        이와 같이 처리하는 것이다.  */
        //추가방법2(비추천) 
        // boardData.push(addBoardDate);
        // console.log(boardData);
        // setBoardData(boardData);

        //일련번호로 사용하는 스테이트를 1 증가
        setNextNo(nextNo+1);
        //글쓰기가 완료되면 화면을 '목록'으로 전환
        setMode('list');
      }}></ArticleWrite>;

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
