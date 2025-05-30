// src/components/board/View.js
import { Link, useParams } from "react-router-dom";

const isImageFile = (filename) => {
    if (!filename || typeof filename !== 'string') {
        return false;
    }
    const ext = filename.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'jfif'].includes(ext);
};


function View(props) {
    const formatDisplayDate = props.formatDisplayDate;

    const { id } = useParams(); 

    console.log('View.js Debug: URL 파라미터 ID:', id);

   
    const vi = props.boardData.find(item => item.id === id);

    if (!vi) {
        console.warn('View.js Debug: 게시물을 찾을 수 없습니다. 현재 boardData:', props.boardData);
        return <div>게시물을 찾을 수 없습니다. (게시물 ID: {id})</div>;
    }

    console.log("View.js Debug: 현재 게시물 데이터 (vi):", vi);
    console.log("View.js Debug: 첨부파일 데이터 (vi.file):", vi.file);
    console.log("View.js Debug: 파일이 이미지인지 여부:", vi.file ? isImageFile(vi.file.name) : "No file");


    return (<>
        <header>
            <h2 className="board-page-header">게시판-읽기</h2>
        </header>
        <nav className="view-nav-buttons">
            <Link to="/free/list">목록</Link>&nbsp;
            <Link to={`/free/edit/${vi.id}`}>수정</Link>&nbsp; {/* id 파라미터 사용 */}
            <Link to={`/free/del/${vi.id}`}>삭제</Link>&nbsp; {/* id 파라미터 사용 */}
        </nav>
        <article>
            <table className="view-table">
                <colgroup>
                    <col width="30%" /><col width="*" />
                </colgroup>
                <tbody>
                    <tr>
                        <th>작성자</th>
                        <td>{vi.writer}</td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td>{vi.title}</td>
                    </tr>
                    <tr>
                        <th>날짜</th>
                        <td>{formatDisplayDate(vi.date)}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{vi.contents}</td>
                    </tr>
                    {vi.file && vi.file.dataUrl && (
                        <tr>
                            <th>첨부파일</th>
                            <td>
                                {isImageFile(vi.file.name) ? (
                                    <img
                                        src={vi.file.dataUrl}
                                        alt={vi.file.name}
                                        style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd' }}
                                    />
                                ) : (
                                    <a href={vi.file.dataUrl} download={vi.file.name}>
                                        {vi.file.name}
                                    </a>
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </article>
    </>);
}

export default View;