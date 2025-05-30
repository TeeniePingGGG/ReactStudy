import { child, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { realtime, storage } from "../realtimeConfig";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// 채팅창을 항상 하단으로 스크롤
const scrollTop = (chatWindow) => {
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
};

// 타임스탬프를 읽기 쉬운 형식으로 변환
const formatTime = (timestamp) => {
  if (!timestamp) return ''; // timestamp가 없을 경우 빈 문자열 반환
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${year}년 ${month}월 ${day}일 ${ampm} ${hours}:${formattedMinutes}`;
};

function ChatMessage() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const userId = searchParams.get('userId');

  const chatWindowRef = useRef(null);
  const [chatData, setChatData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태

  // 메시지 전송 함수 (텍스트 또는 이미지 URL 포함)
  function messageWrite(chatRoom, chatId, chatMessage, imageUrl = null) {
    const newPostRef = push(child(ref(realtime), chatRoom));
    set(newPostRef, {
      id: chatId,
      message: chatMessage,
      timestamp: Date.now(),
      imageUrl: imageUrl // 이미지 URL
    });
  }

  // 이미지 파일 선택 핸들러
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  // 이미지 업로드 및 메시지 전송 핸들러
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

    try {
      // 1. Firebase Storage에 이미지 업로드
      const fileRef = storageRef(storage, `images/${roomId}/${selectedFile.name}_${Date.now()}`);
      const snapshot = await uploadBytes(fileRef, selectedFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // 2. 이미지 URL과 함께 메시지 전송 (메시지 내용은 빈 문자열)
      messageWrite(roomId, userId, "", imageUrl);

      // 3. 상태 초기화
      setSelectedFile(null);
      e.target.imageUpload.value = ''; // input file 초기화
    } catch (error) {
      console.error("이미지 업로드 또는 메시지 전송 실패:", error);
      alert("이미지 전송에 실패했습니다.");
    }
  };

  const dbRef = ref(realtime, roomId);

  useEffect(() => {
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        // Firebase 키를 포함하여 메시지 객체 생성
        messages.push({
          key: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      messages.sort((a, b) => a.timestamp - b.timestamp);

      const showDiv = messages.map((childData) => {
        const timeString = childData.timestamp ? formatTime(childData.timestamp) : '';

        // 메시지 내용이 이미지 URL인지 확인 (이미지 URL이 있고 메시지 내용이 비어있으면 이미지 메시지로 간주)
        const isImageMessage = childData.imageUrl && childData.message === "";

        if (childData.id === userId) {
          return (
            <div key={childData.key} className="myMsg">
              {isImageMessage ? (
                <img src={childData.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              ) : (
                <div>{childData.message}</div>
              )}
              <span className="message-time">{timeString}</span>
            </div>
          );
        } else {
          return (
            <div key={childData.key} className="otherMsg">
              <strong>{childData.id}</strong>
              {isImageMessage ? (
                <img src={childData.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              ) : (
                <span> {childData.message}</span> // 메시지 앞에 공백 추가
              )}
              <span className="message-time">{timeString}</span>
            </div>
          );
        }
      });
      setChatData(showDiv);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, dbRef, userId]);

  // chatData 업데이트 시 스크롤 최하단으로 이동
  useEffect(() => {
    if (chatData.length > 0) {
      requestAnimationFrame(() => {
        if (chatWindowRef.current) {
          scrollTop(chatWindowRef.current);
        }
      });
    }
  }, [chatData]);

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
          {/* 텍스트 메시지 전송 폼 */}
          <form onSubmit={(e) => {
            e.preventDefault();
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
            messageWrite(chatRoom, chatId, message); // 텍스트 메시지 전송
            e.target.message.value = '';
          }} className="chat-input-form" style={{ marginBottom: '10px' }}>
            <input type="hidden" name="chatRoom" value={roomId} />
            <input type="hidden" name="chatId" value={userId} />
            <input type="text" name="message" placeholder="메시지를 입력하세요..." />
            <button type="submit">전송</button>
          </form>

          {/* 이미지 전송 폼 */}
          <form onSubmit={handleImageSend} className="chat-input-form">
            <input type="file" name="imageUpload" accept="image/*" onChange={handleFileChange} />
            <button type="submit" disabled={!selectedFile}>이미지 전송</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatMessage;