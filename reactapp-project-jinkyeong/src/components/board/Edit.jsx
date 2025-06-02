import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firestoreConfig';

function Edit(props) {
    const { boardData, navigate, nowDate } = props;
    const { id } = useParams(); // URL 파라미터에서 'id'값(삭제할 게시물의 ID) 가져옴

    const [selectedFile, setSelectedFile] = useState(null); // 파일 선택 상태 관리
    const [isProcessingFile, setIsProcessingFile] = useState(false); // 파일 처리 중 상태

    //boardData에서 현재 수정 중인 게시물 찾기
    const currentBoard = boardData.find(item => item.id === id);

    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [contents, setContents] = useState('');

    useEffect(() => {
        if (currentBoard) {
            setTitle(currentBoard.title || '');
            setWriter(currentBoard.writer || '');
            setContents(currentBoard.contents || '');
        } else {
            alert("게시물을 찾을 수 없습니다.");
            navigate("/free/list");
        }
    }, [currentBoard, navigate]); 

    //파일 입력 필드 변경 시 호출되는 핸들러
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    // 폼 제출 시 호출되는 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault();

        //폼에서 현재 입력된 값들을 가져옴
        const updatedWriter = event.target.writer.value;
        const updatedTitle = event.target.title.value;
        const updatedContents = event.target.contents.value;

        if (!updatedTitle || !updatedWriter || !updatedContents) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        let fileData = null; // 첨부 파일 데이터 초기화

        if (selectedFile) { 
            setIsProcessingFile(true); // 파일 처리 중 상태로 설정
            try {
                //선택된 파일을 Data URL로 변환
                const reader = new FileReader();

                const filePromise = new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result); //로드 완료시 DataUrl 반환
                    reader.onerror = reject; // 오류 발생시 reject
                    reader.readAsDataURL(selectedFile); //파일을 Data Url로 읽기 시작
                });

                const dataUrl = await filePromise; // 파일 변환 완료까지 대기
                fileData = { 
                    name: selectedFile.name,
                    dataUrl: dataUrl
                };
            } catch (error) {
                console.error("파일 처리 실패:", error);
                alert("파일 처리에 실패했습니다. 다시 시도해주세요.");
                setIsProcessingFile(false); // 처리 중 상태 해제
                return;

            } finally {
                setIsProcessingFile(false); // 성공, 실패 여부와 관계없이 처리 중 상태 해제
            }
        } else if (currentBoard && currentBoard.file) {
            // 파일이 새로 선택되지 않았지만, 기존 파일이 있다면 그 정보를 유지
            fileData = currentBoard.file;
        }

        //업데이트할 게시물 데이터 객체 생성
        const updatedPost = {
            writer: updatedWriter,
            title: updatedTitle,
            contents: updatedContents,
            date: nowDate(),
            file: fileData
        };

        try {
            // Firestore 'board' 컬렉션에서 해당 ID의 문서 참조
            const postDocRef = doc(firestore, 'board', id);

            await updateDoc(postDocRef, updatedPost); // 문서 업데이트
            alert("게시물이 성공적으로 수정되었습니다.");
            navigate(`/free/view/${id}`);
        } catch (error) {
            console.error("게시물 수정 실패:", error);
            alert("게시물 수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <>
            <h2 className="edit-page-header">게시판 수정</h2>
            <nav className="edit-nav-buttons">
                <Link to="/free/list">목록</Link>
            </nav>

            <article className="edit-form-article">
                <form onSubmit={handleSubmit}>
                    <table id="boardTable">
                        <tbody>
                            <tr>
                                <th>작성자</th>
                                <td>
                                    <input
                                        type="text"
                                        name="writer"
                                        value={writer}
                                        onChange={(event) => {
                                            setWriter(event.target.value);
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>제목</th>
                                <td>
                                    <input
                                        type="text"
                                        name="title"
                                        value={title}
                                        onChange={(event) => {
                                            setTitle(event.target.value);
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>내용</th>
                                <td>
                                    <textarea
                                        name="contents"
                                        rows='3'
                                        value={contents}
                                        onChange={(event) => {
                                            setContents(event.target.value);
                                        }}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                            <th>첨부파일</th>
                            <td>
                                <input type="file" name="fileInput" onChange={handleFileChange} />
                                {selectedFile && <p>선택된 파일: {selectedFile.name}</p>}
                                 {/* 새 파일이 선택되지 않았고 기존 파일이 있는 경우 기존 파일 정보 표시 */}
                                {!selectedFile && currentBoard && currentBoard.file && (
                                    <p>현재 파일: {currentBoard.file.name}</p>
                                )}
                                {isProcessingFile && <p>파일 처리 중...</p>}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <input type="submit" value="수정 완료" />

                </form>
            </article>

        </>
    );
}

export default Edit;