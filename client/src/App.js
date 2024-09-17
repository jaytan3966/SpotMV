import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from './views/main';
import Authorize from './views/authorize';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Authorize/>}></Route>
        <Route exact path="/home" element={<Main />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
