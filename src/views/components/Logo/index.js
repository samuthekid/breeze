import styled from 'styled-components';
import logoSrc from 'views/img/logo.svg';

const Logo = styled.div`
  position: fixed;
  top: 2.4rem;
  left: 2.4rem;
  width: 5.3rem;
  height: 3.5rem;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 1;
  background-image: url(${logoSrc});
`;

export default Logo;
