import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../style/global.css';


function Info({ currentUser }) {
    const navigate = useNavigate();

    if (!currentUser) {
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
        return null;
    }

    const handleEditInfo = () => {
        navigate('/editinfo');
    };

    return (
        <div className="info-container">
            <h2 className="info-title">회원정보</h2>
            <table className="info-table">
                <tbody>
                    <tr>
                        <th>아이디</th>
                        <td>{currentUser.id}</td>
                    </tr>
                    <tr>
                        <th>이름</th>
                        <td>{currentUser.name}</td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>{currentUser.email}</td>
                    </tr>
                    <tr>
                        <th>휴대전화</th>
                        <td>{currentUser.phone}</td>
                    </tr>
                    <tr>
                        <th>우편번호</th>
                        <td>{currentUser.zipcode}</td>
                    </tr>
                    <tr>
                        <th>기본주소</th>
                        <td>{currentUser.address}</td>
                    </tr>
                    <tr>
                        <th>상세주소</th>
                        <td>{currentUser.detailAddress}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2" className="info-footer-cell">
                            <button onClick={handleEditInfo} className="info-edit-btn">
                                회원정보 수정
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default Info;

