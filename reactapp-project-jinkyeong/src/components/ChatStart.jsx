import { useRef } from "react";

const ChatStart = () => {
  const refRoom = useRef(); //채팅방 이름을 입력받는 요소에 접근하기 위한 Ref
  const refId = useRef(); // 사용자 ID를 입력받는 요소에 접근하기 위한 Ref

  const openChatWin = () => {
    
    window.open(
      `#/chat/talk?roomId=${refRoom.current.value}&userId=${refId.current.value}`,
      '',
      'width=500, height=700'
    );
  }

  return (
    <>
      <div className="chat-start-container">
        <h2 className="chat-start-title">채팅</h2>

        <div className="chat-start-form-group">
          <label htmlFor="roomId">방명:</label>
          <input type="text" id="roomId" name="roomId" defaultValue="room1" ref={refRoom}></input>
        </div>

        <div className="chat-start-form-group">
          <label htmlFor="userId">대화명:</label>
          <input type="text" id="userId" name="userId" ref={refId}></input>
        </div>

        <button type="button" onClick={openChatWin} className="chat-start-button">
          채팅시작
        </button>
      </div>
    </>
  );
}

export default ChatStart;