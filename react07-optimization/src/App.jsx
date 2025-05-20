import { useEffect } from "react";
import { useState } from "react";

function App() {
  //스테이트 생성 
  const [countNumber, setCountNumber] = useState(0);
  const [randomNumber, setRandomNumber] = useState(0);

  /*
  step1: 일반적인 화살표 함수 선언
    스테이트 변경에 의해 App컴포넌트가 새롭게 렌더링되면 이 함수는
    그때마다 새로운 참조값을 할당받게된다. 즉 참조값이 계속 바뀌므로
    useEffect가 지속적으로 실행된다. JavaScript에서 함수는 객체이기
    때문이다.
  */
  const somthingGood =()=>{
    console.log(`somethingGood호출: ${countNumber}, ${randomNumber}`);
    return;
  }

  useEffect(()=>{
    console.log('somethingGood() or randomGood() 변경됨');
  },[somthingGood]);

  return (<>
  <div className="App">
    <h2>useCallback()</h2>
    {/* 스핀버튼을 누를때마다 스테이트가 변경되어 리렌더링된다.  */}
    <input type="number" value={countNumber}
    onChange={(e)=>setCountNumber(e.target.value)} />
  </div>

    {/* 버튼을 누를때마다 난수를 생성한 후 스테이트를 변경한다. */}
    <button onClick={()=>{
      setRandomNumber(Math.random());
    }}>난수:${randomNumber}</button>
    <br />
    {/* 버튼을 누를때마다 함수를 호출한다.  */}
    <button onClick={somthingGood}>somethingGood 호출</button>
  </>);
}

export default App;
