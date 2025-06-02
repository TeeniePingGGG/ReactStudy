import { child, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { realtime, storage } from "../realtimeConfig";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

//채팅방을 항상 스크롤 하단으로 이동시키는 함수
const scrollTop = (chatWindow) => {
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
};

//타임스탬프를 형식(년월일 오전/오후 시간:분)에 맞게 변환하는 함수
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12; //12시간제로 변환
  hours = hours ? hours : 12; //0시는 12시로 표시
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${year}년 ${month}월 ${day}일 ${ampm} ${hours}:${formattedMinutes}`;
};


function ChatMessage() {
  //URL에서 roomid, uuserid 파라미터 가져오기
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const userId = searchParams.get('userId');

  const chatWindowRef = useRef(null); //채팅 메시지 표시 영역 DOM에 접근하기 위한 Ref
  const [chatData, setChatData] = useState([]); //채팅 메세지 데이터 저장
  const [selectedFile, setSelectedFile] = useState(null); // 전송할 이미지 파일을 저장

  function messageWrite(chatRoom, chatId, chatMessage, imageUrl = null) {
    const newPostRef = push(child(ref(realtime), chatRoom));
    set(newPostRef, {
      id: chatId,
      message: chatMessage,
      timestamp: Date.now(),
      imageUrl: imageUrl
    });
  }

  //이미지 파일 선택시 호출되는 핸들러
  const handleFileChange = (e) => {
    if (e.target.files[0]) { // 파일이 선택되면
      setSelectedFile(e.target.files[0]); // 저장
    } else {
      setSelectedFile(null);
    }
  };

  //이미지 전송 버튼 클릭시 호출되는 핸들러(비동기 처리)
  const handleImageSend = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("대화명을 입력하세요");
      return;
    }

    if (!selectedFile) {
      alert("전송할 이미지를 선택해주세요.");
      return;
    }

    //FireBase에 이미지 업로드
    try {
      const fileRef = storageRef(storage, `images/${roomId}/${selectedFile.name}_${Date.now()}`);
      const snapshot = await uploadBytes(fileRef, selectedFile); // 파일 업로드
      const imageUrl = await getDownloadURL(snapshot.ref); // 업로드된 이미지와 다운로드 URL 가져오기


      messageWrite(roomId, userId, "", imageUrl); //이미지 URL을 포함하여 메시지 작성(초기상태: 메시지 비워둠)

      setSelectedFile(null); // 파일 선택 상태 초기화
      e.target.imageUpload.value = ''; //파일 입력 필드 초기화
    } catch (error) {
      console.error("이미지 업로드 또는 메시지 전송 실패:", error);
      alert("이미지 전송에 실패했습니다.");
    }
  };

  //FireBase RealTime DateBase 특정 채팅방 레퍼런스
  const dbRef = ref(realtime, roomId);

  useEffect(() => {
    //dbRef의 경로의 데이터가 변경될때마다 콜백함수 실행
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const messages = [];

      snapshot.forEach((childSnapshot) => { //각 메세지 스냅샷 순회
        messages.push({
          key: childSnapshot.key, // 메시지 고유 키
          ...childSnapshot.val() //메시지 데이터(id, message, timestamp, imageUrl)
        });
      });

      messages.sort((a, b) => a.timestamp - b.timestamp); // 타임스템프 기준으로 메시지 정렬

      const showDiv = messages.map((childData) => {
        const timeString = childData.timestamp ? formatTime(childData.timestamp) : ''; // 시간 형식화
        const isImageMessage = childData.imageUrl && childData.message === ""; // 이미지 메시지인지 확인

        if (childData.id === userId) { // 내 메시지일때
          return (
            <div key={childData.key} className="myMsg">
              {isImageMessage ? ( //이미지 메시지이면..
                <img src={childData.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              ) : ( //텍스트 메시지이면..
                <div>{childData.message}</div>
              )}
              <span className="message-time">{timeString}</span>
            </div>
          );
        } else { //다른 사람의 메시지일때
          return (
            <div key={childData.key} className="otherMsg">
              <strong>{childData.id}</strong>
              {isImageMessage ? (
                <img src={childData.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              ) : (
                <span> {childData.message}</span>
              )}
              <span className="message-time">{timeString}</span>
            </div>
          );
        }
      });
      setChatData(showDiv); //렌더링시 메시지 데이터 상태 업데이트
    });
    //FireBase 리스너 해제 (메모리 누수 방지)
    return () => {
      unsubscribe();
    };
  }, [roomId, dbRef, userId]); //roomid, dbRef, userid가 변경될떄마 이펙트 재실행

  //메시지 로드 또는 추가시 스크롤 하단 이동
  useEffect(() => {
    if (chatData.length > 0) {
      requestAnimationFrame(() => {
        if (chatWindowRef.current) {
          scrollTop(chatWindowRef.current);
        }
      });
    }
  }, [chatData]); // chatDate가 변경될때마다 재실행(새 메시지 도착 등)

  return (
    <>
      <div className="chat-container">
        <h2 className="chat-header">Realtime 채팅</h2>

        <div className="chat-info">
          <span>대화명: {userId}</span>
          <button id="closeBtn" onClick={() => { window.self.close(); }}>채팅종료</button>
        </div>

        <div id="chatWindow" ref={chatWindowRef}>{chatData}</div>

        <div>
          <form onSubmit={(e) => {
            e.preventDefault();

            //roomid, userid 값을 가져옴
            let chatRoom = e.target.chatRoom.value;
            let chatId = e.target.chatId.value;

            if (chatId === '') {
              alert("대화명을 입력하세요");
              return;
            }
            let message = e.target.message.value;
            if (message === '') {
              alert('메시지를 입력하세요');
              return;
            }
            messageWrite(chatRoom, chatId, message);
            e.target.message.value = '';
          }} className="chat-input-form" style={{ marginBottom: '10px' }}>
            <input type="hidden" name="chatRoom" value={roomId} />
            <input type="hidden" name="chatId" value={userId} />
            <input type="text" name="message" placeholder="메시지를 입력하세요..." />
            <button type="submit">전송</button>
          </form>

          <form onSubmit={handleImageSend} className="chat-input-form">
            <input type="file" name="imageUpload" accept="image/" onChange={handleFileChange} />
            <button type="submit" disabled={!selectedFile}>이미지 전송</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatMessage;