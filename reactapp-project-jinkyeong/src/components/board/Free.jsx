// src/components/board/Free.js
import { Routes, Route, useNavigate } from 'react-router-dom';

import List from './List';
import Write from './Write';
import View from './View';
import Edit from './Edit';
import Del from './Del'; // ⭐ Del 컴포넌트 임포트 ⭐
import { useState } from 'react';

const nowDate =()=>{
  let dateObj = new Date();
  var year = dateObj.getFullYear();
  var month = ("0"+(1+dateObj.getMonth())).slice(-2);
  var day = ("0"+dateObj.getDate()).slice(-2);
  return year+"-"+month+"-"+day;
}

function Free() {
  const[boardData,setBoardData] = useState([
    {no:1, title:'오늘은 React 공부 하는 날', writer:'낙자쌤', date:'2023-01-01',
        contents:'React를 뽀개봅시당'
    },
    {no:2, title:'어제는 JavaScript 공부해씸', writer:'유겸이', date:'2023-03-03',
      contents:'JavaScript는 할게 너무 많아요'
    },
    {no:3, title:'내일은 Project 해야징', writer:'개똥이', date:'2023-05-05',
      contents:'Project는 뭘 만들어볼까?'
    }
  ]);

  const [nextNo, setNextNo] = useState(4);
  const navigate = useNavigate();

  return (<>
    <div className="free-board-container">
      <Routes>
        <Route index element={<List boardData={boardData} />}></Route>
        <Route path="list" element={<List boardData={boardData} />}></Route>

        <Route path="view/:no" element={<View boardData={boardData}/>}/>

        <Route path="write" element={<Write
          boardData={boardData} setBoardData={setBoardData}
          nextNo={nextNo} setNextNo={setNextNo}
          navigate={navigate}
          nowDate={nowDate}>
        </Write>}/>

        <Route path='edit/:no' element={<Edit
          boardData={boardData} setBoardData={setBoardData}
          navigate={navigate} nowDate={nowDate}/>}
        />

        {/* ⭐ Del 컴포넌트를 위한 라우트 추가 ⭐ */}
        <Route path='del/:no' element={<Del
          boardData={boardData} setBoardData={setBoardData}
          navigate={navigate}/>}
        />

      </Routes>
    </div>
  </>);
}

export default Free;