import styled from 'styled-components';
import src from 'views/img/wallpaper.png';

const MainContent = styled.div`
  background: url(${src});
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  position: absolute;
  width: 100%;
  height: 100vh;
  text-align: center;
  z-index: 100;
`;

export default MainContent;
