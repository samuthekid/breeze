import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Box = styled.div`
  height: 3vh;
  margin-top: 2vh;
`;

const Helper = ({ text }) => (
  <Box>
    <span>{text || 'Open options'}</span>
  </Box>
);

Helper.propTypes = {
  text: PropTypes.string,
};

export default Helper;
