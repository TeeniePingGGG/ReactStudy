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

const formatDisplayDate = (postDateString) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    if (!postDateString || typeof postDateString !== 'string') {
        console.warn("formatDisplayDate: Invalid postDateString provided:", postDateString);
        return "";
    }

    const yearMatch = postDateString.match(/(\d{4})년/);
    const monthMatch = postDateString.match(/(\d{2})월/);
    const dayMatch = postDateString.match(/(\d{2})일/);

    if (!yearMatch || !monthMatch || !dayMatch) {
        const datePart = postDateString.split(' ')[0];
        const parts = datePart.match(/(\d{4})년 (\d{2})월 (\d{2})일/);

        if (parts) {
            const postYear = parseInt(parts[1], 10);
            const postMonth = parseInt(parts[2], 10);
            const postDay = parseInt(parts[3], 10);

            if (postYear === currentYear && postMonth === currentMonth && postDay === currentDay) {
                return postDateString;
            } else {
                return `${postYear}년 ${parts[2]}월 ${parts[3]}일`;
            }
        }
        return postDateString;
    }

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
    const [boardData, setBoardData] = useState([]);
    const [nextNo, setNextNo] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const boardCollectionRef = collection(firestore, 'board');
        const q = query(boardCollectionRef, orderBy('no'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = []; // `posts` 변수가 여기서 정의됩니다.
            let maxNo = 0;
            snapshot.forEach((doc) => {
                const data = doc.data();
                posts.push({ id: doc.id, ...data });
                if (data.no && data.no > maxNo) {
                    maxNo = data.no;
                }
            });
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