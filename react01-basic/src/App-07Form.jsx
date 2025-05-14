import { useState } from "react";

function WriteForm(props){
  return(
    //submit 이벤트 리스너를 통해 폼값을 처리한다. 
      <form onSubmit={(e)=>{
        e.preventDefault();
        let writer = e.target.writer.value;
        let title = e.target.title.value;
        let contents = e.target.contents.value;
        props.writeAction(title, writer, contents);
      }}>
        <table border="1">
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
              <td><textarea name="contents" cols='22' rows='3'></textarea></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="전송"/>
      </form>

  );
}


function App() {
  const [message, setMessage] = useState('폼값 검증 진행중');
  return (
    <div className="App">
      <h2>React - For값 처리</h2>
    
    {/* 작성폼 컴포넌트를 추가하면 프롭스를 통해 폼값을 받아 콘솔에
    출력하는 함수를 전달한다. */}
      <WriteForm writeAction={(wr,ti,con)=>{
        console.log("Form값",wr,ti,con);
        //3개의 모든 값을 입력하면 스테이트는 '완료'로 변경한다.
        if(wr!=='' && ti!=='' && con!==''){
          //스테이트가 변경되면 리렌더링된다.
          setMessage('폼값 검증 완료');
        }
      }}></WriteForm>
      {/* 스테이트가 변경되면 리렌더링이 되므로 아래 텍스트가 변경되는
      것을 볼 수 있다. 즉 폼값검증이 완료되었을때 변경된다. */}
      <p>{message}</p>
    </div>
  
  );
}

export default App
