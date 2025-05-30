// src/components/board/Write.jsx
import { Link } from "react-router-dom";
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore'; // addDoc 임포트
import { firestore } from '../../firestoreConfig'; // firestore 임포트

function Write(props) {
    const nextNo = props.nextNo; // Free.jsx에서 계산된 다음 게시물 번호
    const navigate = props.navigate;
    const nowDate = props.nowDate;

    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let writer = event.target.writer.value;
        let title = event.target.title.value;
        let contents = event.target.contents.value;

        if (title === '' || writer === '' || contents === '') {
            alert('제목, 작성자, 내용을 모두 입력해주세요.');
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
                console.log('파일 Data URL 변환 성공 (일부):', dataUrl.substring(0, 50) + '...');
            } catch (error) {
                console.error("파일 처리 실패:", error);
                alert("파일 처리에 실패했습니다. 다시 시도해주세요.");
                setIsProcessingFile(false);
                return;
            } finally {
                setIsProcessingFile(false);
            }
        }

        // 새로운 게시물 데이터 객체 생성
        const newPost = {
            no: nextNo, // nextNo를 명시적으로 할당
            writer: writer,
            title: title,
            contents: contents,
            date: nowDate(),
            file: fileData
        };

        try {
            // 'board' 컬렉션에 새 문서 추가
            await addDoc(collection(firestore, 'board'), newPost);
            alert("게시물이 성공적으로 작성되었습니다.");
            navigate("/free/list"); // 목록 페이지로 이동
        } catch (error) {
            console.error("게시물 작성 실패:", error);
            alert("게시물 작성에 실패했습니다. 다시 시도해주세요.");
        }

        // 폼 필드 초기화
        event.target.writer.value = '';
        event.target.title.value = '';
        event.target.contents.value = '';
        setSelectedFile(null);
        if (event.target.fileInput) {
            event.target.fileInput.value = '';
        }
    };

    return (<>
        <header>
            <h2 className="board-page-header">자유게시판 - 글 작성</h2>
        </header>
        <nav className="view-nav-buttons">
            <Link to="/free/list">목록</Link>
        </nav>
        <article>
            <form onSubmit={handleSubmit} className="write-form">
                <table id="boardTable">
                    <tbody>
                        <tr>
                            <th>작성자</th>
                            <td><input type="text" name="writer" /></td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td><input type="text" name="title" /></td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td><textarea name="contents" cols="22" rows="3"></textarea></td>
                        </tr>
                        <tr>
                            <th>첨부파일</th>
                            <td>
                                <input type="file" name="fileInput" onChange={handleFileChange} />
                                {selectedFile && <p>선택된 파일: {selectedFile.name}</p>}
                                {isProcessingFile && <p>파일 처리 중...</p>}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value={isProcessingFile ? "처리 중..." : "전송"} disabled={isProcessingFile} />
            </form>
        </article>
    </>);
}

export default Write;