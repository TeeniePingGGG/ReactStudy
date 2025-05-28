import { Routes, Route, NavLink } from 'react-router-dom'; 
import Regist from './components/members/Regist';
import Home from './components/Home';
import TopNavi from './components/TopNavi';
import Login from './components/members/Login';
import CherryJubileePage  from './components/explain/CherryJubileePage';
import AppleMint from './components/explain/AppleMint';
import Amondbong from './components/explain/Amondbong';
import Chocotree from './components/explain/chocotree';
import Cheese from './components/explain/Cheese';
import ChatStart from './components/ChatStart';
import ChatMessage from './components/ChatMessage';

import './style/global.css';


function App() {
  return(
    <>
      <div className="main-title-area"> 
        <NavLink to="/">
          <h1>아이스크림이 세상을 지배한다.</h1>
        </NavLink>
      </div>

      <TopNavi/>

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
      </Routes>
    </>
  );
}

export default App;