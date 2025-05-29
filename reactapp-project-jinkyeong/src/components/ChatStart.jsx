import { useRef } from "react"; 

const ChatStart = () => {
  const refRoom = useRef();
  const refId = useRef();
  const openChatWin = () => {
    window.open(
      `/chat/talk?roomId=${refRoom.current.value}&userId=${refId.current.value}`,
      '',
      'width=500, height=700'
    );
  }

  return (
    <>
      <div className="chat-start-container"> {/* 클래스 추가 */}
        <h2 className="chat-start-title">채팅</h2> {/* 클래스 추가 */}
        
        <div className="chat-start-form-group"> {/* 클래스 추가 */}
          <label htmlFor="roomId">방명:</label>
          <input type="text" id="roomId" name="roomId" defaultValue="room1" ref={refRoom}></input>
        </div>
        
        <div className="chat-start-form-group"> {/* 클래스 추가 */}
          <label htmlFor="userId">대화명:</label>
          <input type="text" id="userId" name="userId" ref={refId}></input>
        </div>

        <button type="button" onClick={openChatWin} className="chat-start-button"> {/* 클래스 추가 */}
          채팅시작
        </button>
      </div>
    </>
  );
}

export default ChatStart;