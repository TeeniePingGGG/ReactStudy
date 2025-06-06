import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/global.css';

function EditRe({ currentUser, onUpdateUser }) {
    const navigate = useNavigate();

    if (!currentUser) {
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
        return null;
    }

    const [formData, setFormData] = useState({
        id: currentUser.id || '',
        password: '',
        confirmPassword: '',
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        zipcode: currentUser.zipcode || '',
        address: currentUser.address || '',
        detailAddress: currentUser.detailAddress || ''
    });

    //입력 필그 값이 변경될때 호출되는 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    //폼 제출시 호출되는 함수
    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password) {
            if (formData.password !== formData.confirmPassword) {
                alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                return;
            }
            if (formData.password.length < 4) {
                alert('비밀번호는 4자 이상이어야 합니다.');
                return;
            }
        }

        //기존 currentUser정보와 폼에서 입력된 정보를 병합하여 업데이트될 사용자 객체 생성
        const updatedUser = {
            ...currentUser,
            //새 비번을 입력했다면 새 비번을, 아니면 기존 비번을 유지
            password: formData.password || currentUser.password, 
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            zipcode: formData.zipcode,
            address: formData.address,
            detailAddress: formData.detailAddress
        };

        onUpdateUser(updatedUser); //업데이트된 사용자 정보를 전달

        alert('회원 정보가 성공적으로 수정되었습니다!');
        navigate('/info');
    };

    //우편번호 검색 버튼 클릭시 호출 함수(API 사용)
    const handleZipcodeSearch = () => {

        new window.daum.Postcode({
            oncomplete: function(data) { //주소 검색이 완료되었을때 실행될 콜백 함수
                let fullAddress = data.address; //기본주소
                let extraAddress = ''; //참고 항목 주소

                if (data.addressType === 'R') {
                    if (data.bname !== '') {
                        extraAddress += data.bname;
                    }
                    if (data.buildingName !== '') {
                        extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
                }

                setFormData(prev => ({
                    ...prev,
                    zipcode: data.zonecode,
                    address: fullAddress
                }));
                document.getElementById('detailAddress').focus();
            }
        }).open();
    };

    return (
        <div className="regist-container">
            <h2 className="regist-title">회원정보 수정</h2>
            <form className="regist-form" onSubmit={handleSubmit}>
                <table className="regist-table">
                    <tbody>
                        <tr>
                            <th>아이디</th>
                            <td>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    readOnly
                                    className="regist-input-id"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>새 비밀번호</th>
                            <td>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="새 비밀번호 (변경 시 입력)"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>비밀번호 확인</th>
                            <td>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="새 비밀번호 확인"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="이름"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>이메일</th>
                            <td>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="이메일"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>휴대전화</th>
                            <td>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="휴대전화 번호"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>우편번호</th>
                            <td>
                                <input
                                    type="text"
                                    name="zipcode"
                                    placeholder="우편번호"
                                    value={formData.zipcode}
                                    onChange={handleChange}
                                    readOnly
                                    className="regist-input-zipcode"
                                />
                                <button type="button" onClick={handleZipcodeSearch} className="regist-zipcode-btn">
                                    우편번호 검색
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th>기본주소</th>
                            <td>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="기본주소"
                                    value={formData.address}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>상세주소</th>
                            <td>
                                <input
                                    type="text"
                                    name="detailAddress"
                                    id="detailAddress"
                                    placeholder="상세주소"
                                    value={formData.detailAddress}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* 테이블 바깥에서 버튼을 div로 감싸고 가운데 정렬합니다. */}
                <div className="button-container">
                    <button type="submit" className="regist-submit-btn info-edit-btn">정보수정</button>
                </div>
            </form>
        </div>
    );
}

export default EditRe;