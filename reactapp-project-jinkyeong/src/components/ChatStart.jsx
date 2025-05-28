import { useRef } from "react"; 

const ChatStart=()=>{
  const refRoom = useRef();
  const refId= useRef();
  const openChatWin=()=>{
 
    window.open(`/chat/talk?roomId=${refRoom.current.value}&userId=${refId.current.value}`,
      '','width=500, height=700'
    );
  }

  return(<>
    <div className="App">
      <h2>채팅</h2>
     
      방명:<input type="text" name="roomId" value="room1" ref={refRoom}></input><br />
      대화명:<input type="text" name="userId" ref={refId}></input>

      <button type="button" onClick={openChatWin}>채팅시작</button>
    </div>
  </>);
}

export default ChatStart;