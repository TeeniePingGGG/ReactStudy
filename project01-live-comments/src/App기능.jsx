import { useState } from "react"

function App() {

  //화면전환 스테이트
  const [mode, setMode] = useState('list');

  //선택한 게시물의 일련번호 저장
  const [no, setNo] = useState(null);

  //새로운 게시물의 일련번호를 작성할 시퀀스 용도
  const [nextNo, setNextNo] = useState(1);


  return (<>
  
  </>)
}

export default App
