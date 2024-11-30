import React, { useState } from "react";
import styled from "styled-components";

// 컨테이너 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  height: 100vh;
`;

// 본문 내용을 감싸는 폼
const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border: 2px solid black;
  border-radius: 10px;
  width: 50vw;
  height: 50vh;
`;

// 기본 파일 선택 스타일 숨기기
const FileInput = styled.input`
  display: none;
`;

// 버튼 컨테이너
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px; /* 버튼 사이의 간격 추가 */
  margin-top: 20px;
`;

// 버튼
const Button = styled.button`
  padding: 15px;
  text-decoration: none;
  border-radius: 5px;
  border: 1px solid black;
  color: black;
  font-size: 1.5em;
  background-color: white;
  cursor: pointer;

  &:hover {
  }
`;

// 이미지 미리보기 스타일 정의
const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 5px;
`;

const GetStarted = () => {
  // 선택된 이미지 파일과 미리보기 URL을 저장할 상태 변수
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 파일 선택 시 호출되는 함수
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedImage) {
      alert('이미지를 먼저 업로드 해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedImage as Blob);

    try {
      const response = await fetch('http://localhost:8000/image-save', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Response data:', result);
      alert(result);
    } catch (error) {
      console.error('Error:', error);
      alert('이미지 저장에 실패했습니다.(서버 오류)');
    }
  };

  return (
    <Container>
      <Form>
        {imagePreview && (
          <ImagePreview src={imagePreview} alt="Selected file preview" />
        )}
      </Form>
      <ButtonContainer>
        <label htmlFor="fileInput" aria-label="이미지 선택">
          <Button as="span">이미지 열기</Button>
        </label>
        <FileInput
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button onClick={handleAnalyzeClick}>이미지 저장</Button>
      </ButtonContainer>
    </Container>
  );
};

export default GetStarted;