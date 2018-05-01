import styled from 'styled-components';

const SearchBox = styled.input`
  width: 100%;
  font-size: 5vh;
  line-height: 7vh;
  text-align: center;
  color: #fff;
  text-shadow: 0px 0px 10px #000;
  border-style: none;
  background-color: transparent;
  :focus {
    outline: 0;
  }
`;

export default SearchBox;
