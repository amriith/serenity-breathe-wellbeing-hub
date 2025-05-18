
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Breathing from './Breathing';
import Music from './Music';
import Tips from './Tips';
import Progress from './Progress';

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/breathing" element={<Breathing />} />
      <Route path="/music" element={<Music />} />
      <Route path="/tips" element={<Tips />} />
      <Route path="/progress" element={<Progress />} />
    </Routes>
  );
};

export default Index;
