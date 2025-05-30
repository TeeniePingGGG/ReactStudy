import { child, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { realtime, storage } from "../realtimeConfig";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const scrollTop = (chatWindow) => {
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
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
  const [selectedFile, setSelectedFile] = useState(null);

  function messageWrite(chatRoom, chatId, chatMessage, imageUrl = null) {
    const newPostRef = push(child(ref(realtime), chatRoom));
    set(newPostRef, {
      id: chatId,
      message: chatMessage,
      timestamp: Date.now(),
      imageUrl: imageUrl
    });
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

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
      const fileRef = storageRef(storage, `images/${roomId}/${selectedFile.name}_${Date.now()}`);
      const snapshot = await uploadBytes(fileRef, selectedFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      messageWrite(roomId, userId, "", imageUrl);

      setSelectedFile(null);
      e.target.imageUpload.value = '';
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
        messages.push({
          key: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      messages.sort((a, b) => a.timestamp - b.timestamp);

      const showDiv = messages.map((childData) => {
        const timeString = childData.timestamp ? formatTime(childData.timestamp) : '';
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
                <span> {childData.message}</span>
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