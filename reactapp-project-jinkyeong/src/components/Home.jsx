import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="rolling-banner-container">
        <p className="rolling-text">환영합니다! 아이스크림 세상에 오신 것을 환영합니다. 🍦✨</p>
      </div>

      <h1 className="home-title">kosmo pick 5 !</h1>
      <div className="menulist">
        <Link to="/cherryjubilee">
          <img src="/images/선우체리쥬빌레.png" alt="체리쥬빌레"/>
        </Link>

        <Link to="/applemint">
          <img src="/images/영진애플민트.png" alt="애플민트"/>
        </Link>

        <Link to="/almondbonbon">
          <img src="/images/천아몬드봉봉.png" alt="아몬드봉봉"/>
        </Link>

        <Link to="/chocotreemint">
          <img src="/images/한이초코나무.png" alt="초코나무숲"/>
        </Link>

        <Link to="/cheese">
          <img src="/images/뉴치케.png" alt="뉴욕치즈케이크"/>
        </Link>
      </div>
    </>
  );
}

export default Home;