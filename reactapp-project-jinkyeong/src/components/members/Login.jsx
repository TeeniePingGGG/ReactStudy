import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/global.css';

// Login 컴포넌트가 onLogin prop을 받도록 변경
function Login({ onLogin }) { 
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!id) {
            alert('아이디를 입력해주세요.');
            return;
        }
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        // 로컬 스토리지에서 가입된 사용자 정보 가져오기
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // 입력된 아이디와 비밀번호로 사용자 찾기
        const foundUser = registeredUsers.find(
            (user) => user.id === id && user.password === password
        );

        if (foundUser) {
            alert(`${foundUser.name}님, 로그인되었습니다!`);
            console.log('로그인 성공:', foundUser);
            onLogin(foundUser);
            navigate('/');
        } else {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            console.log('로그인 실패: 아이디 또는 비밀번호 불일치');
        }

        setId('');
        setPassword('');
    };

    return (
        <div className="login-container">
            <h2 className="login-title">로그인</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <table className="login-table">
                    <tbody>
                        <tr>
                            <th>아이디</th>
                            <td>
                                <input
                                    type="text"
                                    placeholder="아이디 입력"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
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
                            <td colSpan="2">
                                <div className="login-btn-wrapper">
                                    <button type="submit" className="login-submit-btn">로그인</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default Login;