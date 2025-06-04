import { Routes, Route, NavLink, useLocation } from 'react-router-dom'; 
import Regist from './components/members/Regist';
import Home from './components/Home';
import TopNavi from './components/TopNavi';
import Login from './components/members/Login';
import CherryJubileePage  from './components/explain/CherryJubileePage';
import AppleMint from './components/explain/AppleMint';
import Amondbong from './components/explain/Amondbong';
import Chocotree from './components/explain/chocotree';
import Cheese from './components/explain/Cheese';
import ChatStart from './components/ChatStart';
import ChatMessage from './components/ChatMessage';
// QnA 컴포넌트 임포트 추가
import QnA from './components/board/QnA'
import Free from './components/board/Free'

import './style/global.css';


function App() {
  const location = useLocation(); //현재경로 정보보

  // TopNavi와 메인 타이틀을 숨길 경로.
  const hideHeadersPaths = ['/chat/talk']; 
  const shouldHideHeaders = hideHeadersPaths.includes(location.pathname);
  
  return(
    <>
      
      {!shouldHideHeaders && (
        <div className="main-title-area"> 
          <NavLink to="/">
            <h1>아이스크림이 세상을 지배한다.🍦</h1>
          </NavLink>
        </div>
      )}

      
      {!shouldHideHeaders && <TopNavi/>} 

      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/regist" element={<Regist/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/cherryjubilee" element={<CherryJubileePage />}></Route>
        <Route path="/applemint" element={<AppleMint />}></Route>
        <Route path="/almondbonbon" element={<Amondbong />}></Route>
        <Route path="/chocotreemint" element={<Chocotree />}></Route>
        <Route path="/cheese" element={<Cheese />}></Route>
        <Route path="/chat">
          <Route index element={<ChatStart></ChatStart>}></Route>
          <Route path="talk" element={<ChatMessage></ChatMessage>}></Route>
        </Route>
        {/* QnA 컴포넌트를 위한 새로운 Route 추가 */}
        <Route path="/qna" element={<QnA />}></Route>
         <Route path="/free/*" element={<Free />}></Route>
      </Routes>
    </>
  );
}

export default App;