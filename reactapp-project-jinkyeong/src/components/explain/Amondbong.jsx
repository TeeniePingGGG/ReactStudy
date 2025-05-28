const Amondbong = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{fontSize:'60px'}}>1000 픽! 아몬드봉봉</h1> 
      <img
        src="/images/천아몬드봉봉.png"
        alt="아몬드봉봉" 
        style={{ maxWidth: '400px', borderRadius: '15px' }} 
      />

      <div className="menu-view__container">
        <h3 style={{ fontSize: '28px', marginBottom: '25px', color: '#ff5c8a', fontFamily: 'Ownglyph_ParkDaHyun, sans-serif' }}>영양정보</h3>
        <div style={{ overflowX: 'auto', maxWidth: '100%', margin: '0 auto' }}> 
          <table
            style={{
              margin: '0 auto',
              borderCollapse: 'collapse',
              fontSize: '16px',
              backgroundColor: '#fff0f5',
              boxShadow: '0 0 10px rgba(255, 192, 203, 0.5)', 
              borderRadius: '10px',
              overflow: 'hidden',
              width: '900px', 
            }}
          >
            <thead style={{ backgroundColor: '#ffc0cb' }}> 
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
                {['115g', '312kcal', '26g', '5g', '8g', '94mg', '우유, 대두'].map((val, idx) => (
                  <td key={idx} style={tableCellStyle}>
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div> 

        <img
          src="/images/아몬드설명.png"
          alt="아몬드봉봉 설명"
          style={{ maxWidth: '100%', height: 'auto', marginTop: '40px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
        />
      </div>
    </div>
  );
};

const tableHeaderStyle = {
  padding: '12px 15px', 
  border: '1px solid #ffdde2', 
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#ff5c8a', 
  fontFamily: '"Ownglyph_ParkDaHyun", "Gowun Dodum", sans-serif',
};

const tableCellStyle = {
  padding: '10px 15px', 
  border: '1px solid #ffdde2', 
  textAlign: 'center',
  color: '#333333', 
  backgroundColor: '#fef0f3', 
};

export default Amondbong;