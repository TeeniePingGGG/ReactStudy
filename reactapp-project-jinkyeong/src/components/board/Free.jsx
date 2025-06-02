// src/components/board/Free.jsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Firestore 관련 임포트
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore } from '../../firestoreConfig'; // firestore 객체 임포트

import List from './List';
import Write from './Write';
import View from './View';
import Edit from './Edit';
import Del from './Del';

const nowDate = () => {
    let dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = ("0" + (1 + dateObj.getMonth())).slice(-2);
    var day = ("0" + dateObj.getDate()).slice(-2);

    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${year}년 ${month}월 ${day}일 ${ampm} ${hours}:${formattedMinutes}`;
};

//게시물 날짜를 화면에 표시하기 적절한 형식으로 변환하는 함수(오늘 날짜는 시간까지, 아니면 년 월 일만 표시)
const formatDisplayDate = (postDateString) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    if (!postDateString || typeof postDateString !== 'string') {
        console.warn("formatDisplayDate: Invalid postDateString provided:", postDateString);
        return "";
    }

    //년 월 일 정보 추출(정규식 사용)
    const yearMatch = postDateString.match(/(\d{4})년/);
    const monthMatch = postDateString.match(/(\d{2})월/);
    const dayMatch = postDateString.match(/(\d{2})일/);

    const postYear = parseInt(yearMatch[1], 10);
    const postMonth = parseInt(monthMatch[1], 10);
    const postDay = parseInt(dayMatch[1], 10);

    if (postYear === currentYear && postMonth === currentMonth && postDay === currentDay) {
        return postDateString;
    } else {
        return `${postYear}년 ${monthMatch[0]} ${dayMatch[0]}`;
    }
};


function Free() {
    const [boardData, setBoardData] = useState([]); // 게시물 데이터를 저장
    const [nextNo, setNextNo] = useState(1); // 다음 게시물 번호를 저장
    const navigate = useNavigate(); // 페이지 이동을 위한 훅 

    //Firestore에서 게시물 데이터를 실시간으로 가져옴
    useEffect(() => {
        const boardCollectionRef = collection(firestore, 'board');
        const q = query(boardCollectionRef, orderBy('no')); // no를 기준으로 오름차순으로 정렬

        //onSnapshot: 데이터 변경을 실시간으로 감지
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = []; //받아온 게시물 데이터를 담을 배열
            let maxNo = 0; //가장 큰 no를 찾기 위한 변수

            // 각 게시물 순회
            snapshot.forEach((doc) => {
                const data = doc.data(); // 문서 데이터 가져오기
                posts.push({ id: doc.id, ...data }); //문서 id와 데이터를 배열에 추가
                if (data.no && data.no > maxNo) { //'no' 필드가 있고 현재 maxNo보가 크면 업데이트
                    maxNo = data.no;
                }
            });
            
        // 게시물 번호를 다시 부여하고 정렬
        const renumberedPosts = posts.sort((a, b) => a.no - b.no)
                .map((post, index) => ({ ...post, no: index + 1 })); 

            setBoardData(renumberedPosts); 
            setNextNo(maxNo + 1); 

        }, (error) => {
            console.error("Firebase 데이터 로드 오류:", error);
        });

        return () => unsubscribe();
    }, []);

    return (<>
        <div className="free-board-container">
            <Routes>
                <Route index element={<List boardData={boardData} formatDisplayDate={formatDisplayDate} />}></Route>
                <Route path="list" element={<List boardData={boardData} formatDisplayDate={formatDisplayDate} />}></Route>
                <Route path="view/:id" element={<View boardData={boardData} formatDisplayDate={formatDisplayDate} />} />

                <Route path="write" element={<Write
                    boardData={boardData}
                    setBoardData={setBoardData}
                    nextNo={nextNo}
                    navigate={navigate}
                    nowDate={nowDate}>
                </Write>} />

                <Route path='edit/:id' element={<Edit
                    boardData={boardData}
                    navigate={navigate}
                    nowDate={nowDate} />}
                />

                <Route path='del/:id' element={<Del
                    navigate={navigate}
                />}
                />
            </Routes>
        </div>
    </>);
}

export default Free;