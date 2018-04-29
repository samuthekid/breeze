import React from 'react';
import styled from 'styled-components';
import src from 'views/img/wallpaper.png';

const Wallpaper = styled.div`
  background: url(${src});
  position: absolute;
  width: 100%;
  height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  position: absolute;
  width: 100%;
  padding-top: 20vh;
  height: 80vh;
  max-height: 80vh;
  text-align: center;
  z-index: 100;
`;

const Background = ({ onClick, children }) => (
  <div>
    <Wallpaper />

    <MainContent onClick={onClick}>{children}</MainContent>
  </div>
);

export default Background;
