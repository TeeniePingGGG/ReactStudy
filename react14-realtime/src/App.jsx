import {BrowserRouter, Route, Routes} from 'react-router-dom';

import RealtimeCRUD from './components/RealtimeCRUD';
// import Listener from './components/Listener';
// import ChatStart from './components/ChatStart';
// import ChatMessage from './components/ChatMessage';




function App() {

  return(<>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RealtimeCRUD></RealtimeCRUD>}></Route>
        <Route path="/crud" element={<RealtimeCRUD></RealtimeCRUD>}></Route>
        {/* <Route path="/listener" element={<Listener></Listener>}></Route> */}
        {/* <Route path="/chat">
          <Route index element={<ChatStart></ChatStart>}></Route>
          <Route path="talk" element={<chatMessage></chatMessage>}></Route>
        </Route> */}
      </Routes>
    </BrowserRouter>
  </>);
}

export default App
