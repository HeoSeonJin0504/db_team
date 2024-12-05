import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

const Container = styled.div`
  display: flex;
  padding: 20px;
`;

const LeftContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
`;

const RightContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const LeftForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid black;
  border-radius: 10px;
  width: 40vw;
  height: 40vh;
  text-align: center;
  justify-content: center;
  margin-top: 120px;
  background-color: white;
`;

const RightForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid black;
  border-radius: 10px;
  width: 40vw;
  min-height: 40vh;
  max-height: 100vh;
  text-align: center;
  justify-content: center;
  margin-top: 120px;
  background-color: white;
`;

const FileInput = styled.input`
  display: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 15px;
  text-decoration: none;
  background: #abb7b7;
  border: 2px solid #abb7b7;
  font-weight: bold;
  border-radius: 7px;
  color: white;
  font-size: 1.5em;
  cursor: pointer;

  &:hover {
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 5px;
`;

const ListBox = styled.ul`
  width: 100%;
  height: 200px;
  margin-top: 20px;
  list-style-type: none;
  padding: 0;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ListItem = styled.li<{ selected: boolean }>`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: ${(props) => (props.selected ? "#e0e0e0" : "white")};
  cursor: pointer;

  &:last-child {
    border-bottom: 2px solid #ccc; /* 마지막 행을 두껍게 */
  }

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageList, setImageList] = useState<{ name: string; path: string }[]>([]);
  const [selectedImagePath, setSelectedImagePath] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      alert("이미지를 먼저 업로드 해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage as Blob);

    try {
      const response = await fetch("http://localhost:8000/image-save", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Response data:", result);
      alert(result.message);
    } catch (error) {
      console.error("Error:", error);
      alert("이미지 저장 실패(서버 오류)");
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:8000/images");
      const data = await response.json(); // 이미지 목록 가져오는 코드
      setImageList(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("이미지 새로고침 실패 (서버 오류)");
    }
  };

  const handleImageClick = (path: string) => {
    setSelectedImagePath(path);
  };

  const handleViewImageClick = () => {
    if (selectedImagePath) {
      setIsModalOpen(true);
    } else {
      alert("이미지를 선택해주세요.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <LeftContainer>
        <LeftForm>
          {imagePreview && (
            <ImagePreview src={imagePreview} alt="Selected file preview" />
          )}
        </LeftForm>
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
      </LeftContainer>
      <RightContainer>
        <RightForm>
          <ListBox>
            {imageList.map((image, index) => (
              <ListItem
                key={index}
                selected={selectedImagePath === image.path}
                onClick={() => handleImageClick(image.path)}
              >
                {`${image.name} - ${image.path}`}
              </ListItem>
            ))}
          </ListBox>
        </RightForm>
        <ButtonContainer>
          <Button onClick={fetchImages}>새로고침</Button>
          <Button onClick={handleViewImageClick}>이미지 보기</Button>
        </ButtonContainer>
      </RightContainer>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Image Modal">
        <ModalContent>
          <ModalImage src={selectedImagePath || ""} alt="Selected Image" />
          <ModalButtonContainer>
            <Button onClick={closeModal}>닫기</Button>
          </ModalButtonContainer>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Home;