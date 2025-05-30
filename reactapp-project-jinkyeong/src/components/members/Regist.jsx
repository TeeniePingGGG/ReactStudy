import React, { useState, useRef } from 'react';
import DaumPostcode from 'react-daum-postcode';
import '../../style/global.css';

function Regist() {
  // 기존 상태 변수들
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // 이름 상태
  const [emailId1, setEmailId1] = useState('');
  const [emailId2, setEmailId2] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // 아이디 중복 확인 관련 상태
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  // 우편번호 팝업 열림/닫힘 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // useRef 훅을 사용하여 DOM 요소에 접근할 참조 생성
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);
  const zipcodeBtnRef = useRef(null); 

  // 아이디 중복 확인
  const handleIdCheck = () => {
    setIsIdChecked(true);

    if (!id) {
      alert('아이디를 입력해주세요.');
      setIsIdAvailable(false);
      return;
    }

    // 로컬 스토리지에서 가입된 사용자 목록 가져오기 (비밀번호, 이름 등 포함)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // 아이디 중복 확인
    const isDuplicate = registeredUsers.some(user => user.id === id);

    if (isDuplicate) {
      alert('이미 사용 중인 아이디입니다.');
      setIsIdAvailable(false);
    } else {
      alert('사용 가능한 아이디입니다.');
      setIsIdAvailable(true);
    }
  };

  // 아이디 입력 필드 변경 핸들러
  const handleIdChange = (e) => {
    setId(e.target.value);
    setIsIdChecked(false);
    setIsIdAvailable(false);
  };

  // 전화번호 입력 필드 변경 및 자동 포커싱 핸들러
  const handlePhoneChange = (e, field) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (field === 'phone1') {
      setPhone1(value);
      if (value.length === 3 && phone2Ref.current) {
        phone2Ref.current.focus();
      }
    } else if (field === 'phone2') {
      setPhone2(value);
      if (value.length === 4 && phone3Ref.current) {
        phone3Ref.current.focus();
      }
    } else if (field === 'phone3') {
      setPhone3(value);
      if (value.length === 4 && zipcodeBtnRef.current) {
        zipcodeBtnRef.current.focus();
      }
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!id) { alert('아이디를 입력해주세요.'); return; }
    if (!isIdChecked) { alert('아이디 중복 확인을 해주세요.'); return; }
    if (!isIdAvailable) { alert('사용 불가능한 아이디입니다. 다른 아이디를 사용해주세요.'); return; }

    if (!password) { alert('비밀번호를 입력해주세요.'); return; }
    if (!confirmPassword) { alert('비밀번호 확인을 입력해주세요.'); return; }
    if (password !== confirmPassword) { alert('비밀번호가 일치하지 않습니다.'); return; }
    if (!name) { alert('이름을 입력해주세요.'); return; } // 이름 유효성 검사
    if (!emailId1) { alert('이메일 아이디를 입력해주세요.'); return; }
    if (emailDomain === 'self') {
      if (!emailId2) { alert('이메일 도메인을 직접 입력해주세요.'); return; }
    } else if (!emailDomain) {
      alert('이메일 도메인을 선택해주세요.');
      return;
    }
    if (!phone1 || !phone2 || !phone3 || phone1.length !== 3 || phone2.length !== 4 || phone3.length !== 4) {
      alert('휴대전화 번호를 정확히 입력해주세요.');
      return;
    }
    if (!zipcode) { alert('우편번호를 검색해주세요.'); return; }
    if (!address) { alert('기본주소를 입력해주세요.'); return; }
    if (!detailAddress) { alert('상세주소를 입력해주세요.'); return; }

    // 모든 유효성 검사 통과 후 사용자 정보 객체 생성
    const fullPhoneNumber = `${phone1}-${phone2}-${phone3}`;
    
    
    const user = {
      id: id,
      password: password, 
      name: name, 
      email: `${emailId1}@${emailDomain === 'self' ? emailId2 : emailDomain}`,
      phone: fullPhoneNumber,
      zipcode: zipcode,
      address: address,
      detailAddress: detailAddress,
    };

    // 로컬 스토리지에서 기존 사용자 목록 가져오기
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    // 새 사용자 추가
    registeredUsers.push(user);
    // 업데이트된 사용자 목록 저장
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('회원가입이 완료되었습니다!');
    console.log('가입된 사용자:', user);

    // 폼 초기화
    setId('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setEmailId1('');
    setEmailId2('');
    setEmailDomain('');
    setPhone1('');
    setPhone2('');
    setPhone3('');
    setZipcode('');
    setAddress('');
    setDetailAddress('');
    setIsIdChecked(false);
    setIsIdAvailable(false);
  };

  // 이메일 도메인 select 변경 핸들러
  const handleEmailDomainChange = (e) => {
    setEmailDomain(e.target.value);
    if (e.target.value !== 'self') {
      setEmailId2('');
    }
  };

  // 우편번호 검색 완료 핸들러
  const handlePostcodeComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    setZipcode(data.zonecode);
    setAddress(fullAddress);
    setIsPostcodeOpen(false);
  };

  // 우편번호 팝업 스타일
  const postCodeStyle = {
    display: 'block',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '500px',
    zIndex: 100
  };

  return (
    <div className="regist-container">
      <h2 className="regist-title">회원가입</h2>
      <form className="regist-form" onSubmit={handleSubmit}>
        <table className="regist-table">
          <tbody>
            <tr>
              <th>아이디</th>
              <td>
                <input
                  type="text"
                  placeholder="아이디 입력"
                  className="regist-input-id"
                  value={id}
                  onChange={handleIdChange}
                  readOnly={isIdAvailable}
                />
                <button
                  type="button"
                  className="regist-check-id-btn"
                  onClick={handleIdCheck}
                  disabled={isIdAvailable}
                >
                  중복확인
                </button>
              </td>
            </tr>
            <tr>
              <th>비밀번호</th>
              <td>
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>비밀번호 확인</th>
              <td>
                <input
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>이름</th>
              <td>
                <input
                  type="text"
                  placeholder="이름 입력"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>
                <input
                  type="text"
                  placeholder="이메일 아이디"
                  className="regist-input-email-id1"
                  value={emailId1}
                  onChange={(e) => setEmailId1(e.target.value)}
                />
                <span className="regist-email-at">@</span>
                {emailDomain === 'self' ? (
                  <input
                    type="text"
                    placeholder="도메인 직접 입력"
                    className="regist-input-email-id2"
                    value={emailId2}
                    onChange={(e) => setEmailId2(e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="도메인 선택됨"
                    className="regist-input-email-id2"
                    value={emailDomain}
                    readOnly
                  />
                )}
                <select
                  className="regist-select-email-domain"
                  value={emailDomain}
                  onChange={handleEmailDomainChange}
                >
                  <option value="">도메인 선택</option>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="daum.net">daum.net</option>
                  <option value="kakao.com">kakao.com</option>
                  <option value="self">직접 입력</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>휴대전화</th>
              <td>
                <input
                  type="tel"
                  maxLength="3"
                  placeholder="010"
                  value={phone1}
                  onChange={(e) => handlePhoneChange(e, 'phone1')}
                  className="regist-phone-input"
                  style={{ width: '60px' }}
                />
                <span className="regist-phone-hyphen">-</span>
                <input
                  type="tel"
                  maxLength="4"
                  placeholder="0000"
                  value={phone2}
                  onChange={(e) => handlePhoneChange(e, 'phone2')}
                  ref={phone2Ref}
                  className="regist-phone-input"
                  style={{ width: '70px' }}
                />
                <span className="regist-phone-hyphen">-</span>
                <input
                  type="tel"
                  maxLength="4"
                  placeholder="0000"
                  value={phone3}
                  onChange={(e) => handlePhoneChange(e, 'phone3')}
                  ref={phone3Ref}
                  className="regist-phone-input"
                  style={{ width: '70px' }}
                />
              </td>
            </tr>
            <tr>
              <th>우편번호</th>
              <td>
                <input
                  type="text"
                  placeholder="우편번호"
                  className="regist-input-zipcode"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  readOnly
                />
                <button
                  type="button"
                  className="regist-zipcode-btn"
                  onClick={() => setIsPostcodeOpen(true)}
                  ref={zipcodeBtnRef}
                >
                  검색
                </button>
              </td>
            </tr>
            <tr>
              <th>기본주소</th>
              <td>
                <input
                  type="text"
                  placeholder="기본주소"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <th>상세주소</th>
              <td>
                <input
                  type="text"
                  placeholder="상세주소"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <button type="submit" className="regist-submit-btn">가입하기</button>
      </form>

      {isPostcodeOpen && (
        <div style={postCodeStyle}>
            <DaumPostcode
                onComplete={handlePostcodeComplete}
                autoClose={false}
                defaultQuery={zipcode}
            />
            <button
                onClick={() => setIsPostcodeOpen(false)}
                style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    zIndex: '101',
                    backgroundColor: '#ff6b81',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: '0 10px 0 0',
                }}
            >
                X
            </button>
        </div>
      )}
    </div>
  );
}

export default Regist;