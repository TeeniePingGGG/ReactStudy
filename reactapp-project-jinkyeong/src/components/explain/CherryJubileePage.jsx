// src/components/CherryJubileePage.jsx
import React from 'react';

const CherryJubileePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{fontSize:'60px'}}>선우 픽! 체리쥬빌레</h1>
      <img
        src="/images/선우체리쥬빌레.png"
        alt="체리쥬빌레"
        style={{ maxWidth: '400px', borderRadius: '15px' }} // 이미지에도 스타일 추가
      />

      <div className="menu-view__container">
        <h3 style={{ fontSize: '28px', marginBottom: '25px', color: '#ff5c8a', fontFamily: 'Ownglyph_ParkDaHyun, sans-serif' }}>영양정보</h3> {/* h3 스타일 개선 */}
        <div style={{ overflowX: 'auto', maxWidth: '100%', margin: '0 auto' }}> {/* 가로 스크롤을 위한 래퍼 추가 */}
          <table
            style={{
              margin: '0 auto',
              borderCollapse: 'collapse',
              fontSize: '16px',
              backgroundColor: '#fff0f5', // 연핑크 배경
              boxShadow: '0 0 10px rgba(255, 192, 203, 0.5)', // 연핑크 그림자
              borderRadius: '10px',
              overflow: 'hidden',
              width: '900px', // ★★★ 이 부분을 조정하여 테이블의 최소 너비를 확보합니다.
                       // 내용이 많아 가로로 스크롤되어야 한다면 이 값을 충분히 크게 설정
                       // 또는 width: '100%'; minWidth: '700px'; 형태로 사용
            }}
          >
            <thead style={{ backgroundColor: '#ffc0cb' }}> {/* 헤더 배경색 변경 */}
              <tr>
                {[
                  '1회 제공량',
                  '열량(kcal)',
                  '당류(g)',
                  '단백질(g)',
                  '포화지방(g)',
                  '나트륨(mg)',
                  '알레르기 성분',
                ].map((item, idx) => (
                  <th key={idx} style={tableHeaderStyle}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* 데이터에 단위 추가 */}
                {['115g', '239kcal', '28g', '3g', '7g', '48mg', '우유'].map((val, idx) => (
                  <td key={idx} style={tableCellStyle}>
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div> {/* 가로 스크롤 래퍼 종료 */}

        {/* 설명 이미지도 중앙 정렬 및 여백 추가 */}
        <img
          src="/images/체리설명.png"
          alt="체리쥬빌레 설명"
          style={{ maxWidth: '100%', height: 'auto', marginTop: '40px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
        />
      </div>
    </div>
  );
};

// 스타일 객체
const tableHeaderStyle = {
  padding: '12px 15px', // ★★★ 패딩을 줄여 셀 너비 확보
  border: '1px solid #ffdde2', // 연핑크 테두리
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#ff5c8a', // 헤더 텍스트 색상
  fontFamily: '"Ownglyph_ParkDaHyun", "Gowun Dodum", sans-serif', // 헤더 폰트
};

const tableCellStyle = {
  padding: '10px 15px', // ★★★ 패딩을 줄여 셀 너비 확보
  border: '1px solid #ffdde2', // 연핑크 테두리
  textAlign: 'center',
  color: '#333333', // 기본 텍스트 색상
  backgroundColor: '#fef0f3', // 셀 배경색 (짝수행은 나중에 CSS로 컨트롤하는 것이 좋음)
};

export default CherryJubileePage;