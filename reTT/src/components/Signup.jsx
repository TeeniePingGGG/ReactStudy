import React, { useState, useRef } from 'react';
import DaumPostcode from 'react-daum-postcode';

function Sign() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '', // 이메일 아이디 부분
    emailDomain: '', // 이메일 도메인 부분
    phone1: '',
    phone2: '',
    phone3: '',
    zonecode: '',
    address: '',
    detailAddress: '',
    openPostcode: false, // 다음 주소 검색 팝업 상태
  });

  const [isCheckedId, setIsCheckedId] = useState(false); // 아이디 중복확인 여부
  const [emailOption, setEmailOption] = useState(''); // 이메일 도메인 선택값
  const phone2Ref = useRef();
  const phone3Ref = useRef();

  // 폼 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 휴대전화 입력에 따라 자동 포커싱
    if (name === 'phone1' && value.length === 3) phone2Ref.current.focus();
    if (name === 'phone2' && value.length === 4) phone3Ref.current.focus();

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 아이디 중복 확인 핸들러 (로컬 스토리지 기반)
  const handleIdCheck = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = storedUsers.some((user) => user.username === form.username);

    if (!form.username) {
        alert("아이디를 입력해주세요.");
        return;
    }

    if (userExists) {
      alert('이미 존재하는 아이디입니다.');
      setIsCheckedId(false);
    } else {
      alert('사용 가능한 아이디입니다.');
      setIsCheckedId(true);
    }
  };

  // 이메일 도메인 선택 핸들러
  const handleEmailSelect = (e) => {
    const domain = e.target.value;
    setEmailOption(domain);
    setForm((prev) => ({
      ...prev,
      emailDomain: domain === 'custom' ? '' : domain, // '직접입력' 선택 시 도메인 초기화
    }));
  };

  // 다음 주소 검색 완료 핸들러
  const handleCompleteAddress = (data) => {
    setForm((prev) => ({
      ...prev,
      zonecode: data.zonecode,
      address: data.address,
      openPostcode: false, // 주소 검색 후 팝업 닫기
    }));
  };

  // 최종 회원가입 제출 핸들러 (로컬 스토리지 저장)
  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수 입력 체크
    const requiredFields = ['username', 'password', 'confirmPassword', 'name', 'email', 'emailDomain', 'phone1', 'phone2', 'phone3', 'zonecode', 'address', 'detailAddress'];
    for (let key of requiredFields) {
      if (!form[key]) {
        alert(`${key} 항목을 입력하세요.`);
        return;
      }
    }

    // 비밀번호 일치 확인
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // 비밀번호 최소 길이 확인 (Firebase의 기본값 6자 이상을 따름)
    if (form.password.length < 6) {
      alert("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    // 아이디 중복 확인 여부 체크
    if (!isCheckedId) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }

    // 로컬 스토리지에서 기존 사용자 데이터 가져오기 (없으면 빈 배열)
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // 회원가입할 아이디가 이미 존재하는지 최종 확인
    const userExists = storedUsers.some((user) => user.username === form.username);
    if (userExists) {
      alert("이미 존재하는 아이디입니다.");
      setIsCheckedId(false); // 다시 중복 확인 필요
      return;
    }

    // 새 사용자 객체 생성 (전체 폼 데이터 저장)
    const newUser = { ...form };
    delete newUser.confirmPassword; // 비밀번호 확인 필드는 저장하지 않음
    delete newUser.openPostcode; // 팝업 상태는 저장하지 않음

    // 기존 사용자 데이터에 새 사용자 추가
    const updatedUsers = [...storedUsers, newUser];

    // 업데이트된 사용자 데이터를 로컬 스토리지에 저장
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert('회원가입이 완료되었습니다!');
    console.log("저장된 사용자 정보:", newUser); // 디버깅용
    // 폼 초기화 또는 다른 페이지로 이동
    setForm({
      username: '', password: '', confirmPassword: '', name: '',
      email: '', emailDomain: '', phone1: '', phone2: '', phone3: '',
      zonecode: '', address: '', detailAddress: '', openPostcode: false,
    });
    setIsCheckedId(false);
    setEmailOption('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>회원가입</h2>

      {/* 아이디 입력 및 중복확인 */}
      <label>아이디:</label>
      <input name="username" value={form.username} onChange={handleChange} placeholder="아이디" />
      <button type="button" onClick={handleIdCheck}>중복확인</button>
      <br />

      {/* 비밀번호 / 비밀번호 확인 */}
      <label>비밀번호:</label>
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="비밀번호 (최소 6자)" />
      <br />
      <label>비밀번호 확인:</label>
      <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="비밀번호 확인" />
      <br />

      {/* 이름 */}
      <label>이름:</label>
      <input name="name" value={form.name} onChange={handleChange} placeholder="이름" />
      <br />

      {/* 이메일 입력 + 도메인 선택 */}
      <label>이메일:</label>
      <div>
        <input name="email" value={form.email} onChange={handleChange} placeholder="이메일 아이디" />
        <span>@</span>
        <input
          name="emailDomain"
          value={form.emailDomain}
          onChange={handleChange}
          placeholder="도메인"
          readOnly={emailOption !== 'custom' && emailOption !== ''}
        />
        <select onChange={handleEmailSelect} value={emailOption}>
          <option value="">선택</option>
          <option value="naver.com">naver.com</option>
          <option value="gmail.com">gmail.com</option>
          <option value="hanmail.net">hanmail.net</option>
          <option value="custom">직접입력</option>
        </select>
      </div>
      <br />

      {/* 휴대전화 번호 */}
      <label>휴대전화:</label>
      <div>
        <input name="phone1" maxLength="3" value={form.phone1} onChange={handleChange} placeholder="010" /> -
        <input name="phone2" maxLength="4" ref={phone2Ref} value={form.phone2} onChange={handleChange} placeholder="1234" /> -
        <input name="phone3" maxLength="4" ref={phone3Ref} value={form.phone3} onChange={handleChange} placeholder="5678" />
      </div>
      <br />

      {/* 주소 (다음 API 활용) */}
      <label>주소:</label>
      <div>
        <button type="button" onClick={() => setForm((prev) => ({ ...prev, openPostcode: true }))}>주소찾기</button>
        <br />
        <input name="zonecode" value={form.zonecode} readOnly placeholder="우편번호" />
        <br />
        <input name="address" value={form.address} readOnly placeholder="기본주소" />
        <br />
        <input name="detailAddress" value={form.detailAddress} onChange={handleChange} placeholder="상세주소" />
      </div>

      {form.openPostcode && (
        <DaumPostcode onComplete={handleCompleteAddress} autoClose />
      )}
      <br />

      <button type="submit">회원가입</button>
    </form>
  );
}

export default Sign;