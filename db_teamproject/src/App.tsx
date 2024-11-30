import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages";
import styled from "styled-components";

const Style = styled.main`
  display: flex;
  flex-direction: column;
  width: 100wv;
  min-height: 100vh;
`;

function App() {
  return (
    <>
      <Style>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </Style>
    </>
  );
}

export default App;
