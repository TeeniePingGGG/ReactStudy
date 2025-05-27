import { Link } from 'react-router-dom';

function About() {
  return (
    <>
      <div className="header_section header_bg">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/"><img src="images/logo.png" alt="logo" /></Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/icecream">Icecream</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/services">Services</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/blog">Blog</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact Us</Link>
                </li>
              </ul>
              <form className="form-inline my-2 my-lg-0">
                <div className="login_bt">
                  <a href="#">
                    Login <span style={{ color: "#222222" }}><i className="fa fa-user" aria-hidden="true"></i></span>
                  </a>
                </div>
                <div className="fa fa-search form-control-feedback"></div>
              </form>
            </div>
          </nav>
        </div>
      </div>

      <div className="about_section layout_padding">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="about_img"><img src="images/about-img.png" alt="about" /></div>
            </div>
            <div className="col-md-6">
              <h1 className="about_taital">About Icecream</h1>
              <p className="about_text">
                Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...
              </p>
              <div className="read_bt_1"><a href="#">Read More</a></div>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright_section margin_top90">
        <div className="container">
          <p className="copyright_text">
            2020 All Rights Reserved. Design by <a href="https://html.design">Free Html Templates</a> Distribution by <a href="https://themewagon.com">ThemeWagon</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
