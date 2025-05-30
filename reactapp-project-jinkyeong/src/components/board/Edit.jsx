import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firestoreConfig';

function Edit(props) {
    const { boardData, navigate, nowDate } = props;
    const { id } = useParams();

    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    // `vi` 대신 `currentBoard`로 변경하여 혼동 방지
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
    }, [currentBoard, navigate]); // 의존성 배열에 currentBoard 추가

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedWriter = event.target.writer.value;
        const updatedTitle = event.target.title.value;
        const updatedContents = event.target.contents.value;

        if (!updatedTitle || !updatedWriter || !updatedContents) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        let fileData = null;

        if (selectedFile) {
            setIsProcessingFile(true);
            try {
                const reader = new FileReader();
                const filePromise = new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedFile);
                });
                const dataUrl = await filePromise;
                fileData = {
                    name: selectedFile.name,
                    dataUrl: dataUrl
                };
            } catch (error) {
                console.error("파일 처리 실패:", error);
                alert("파일 처리에 실패했습니다. 다시 시도해주세요.");
                setIsProcessingFile(false);
                return;
            } finally {
                setIsProcessingFile(false);
            }
        } else if (currentBoard && currentBoard.file) {
            // 파일이 새로 선택되지 않았지만, 기존 파일이 있다면 그 정보를 유지
            fileData = currentBoard.file;
        }

        const updatedPost = {
            writer: updatedWriter,
            title: updatedTitle,
            contents: updatedContents,
            date: nowDate(),
            file: fileData
        };

        try {
            const postDocRef = doc(firestore, 'board', id);
            await updateDoc(postDocRef, updatedPost);
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