import { useEffect, useId, useRef } from 'react';

function App() {
  return (
    <>
      <MyInput1 />
    </>
  );
}

function MyInput1() {
  // useId와 useRef로 상수 생성
  const myId = useId();
  const myRef = useRef();

  useEffect(() => {
    const button1 = document.getElementById('btn');
    const button2 = myRef.current;
    console.log('버튼1', button1);
    console.log('버튼2', button2);
  }, []);

  // 버튼1: getElementById를 통한 DOM 접근
  function btn1Clicked() {
    const button1 = document.getElementById('btn');
    if (button1.style.backgroundColor === 'black') {
      button1.style.backgroundColor = 'white';
      button1.style.color = 'black';
    } else {
      button1.style.backgroundColor = 'black';
      button1.style.color = 'white';
    }
  }

  // 버튼2: useRef를 통해 직접 DOM 접근
  function btn2Clicked() {
    const button2 = myRef.current;
    if (button2.style.backgroundColor === 'blue') {
      button2.style.backgroundColor = 'yellow';
      button2.style.color = 'red';
    } else {
      button2.style.backgroundColor = 'blue';
      button2.style.color = 'white';
    }
  }

  return (
    <div>
      <button id="btn" onClick={btn1Clicked}>
        버튼1
      </button>
      <button
        id={myId}
        ref={myRef}
        onClick={btn2Clicked}
        style={{ backgroundColor: 'yellow', color: 'red' }}
      >
        버튼2
      </button>
    </div>
  );
}

export default App;
