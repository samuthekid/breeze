import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';

import App from 'views/components/App';

import gRegular from 'views/fonts/GRegular.ttf';
import fdLight from 'views/fonts/FDLight.ttf';
import robotoThin from 'views/fonts/RobotoThin.ttf';

injectGlobal`
  @font-face {
    font-family: G;
    src: url('${gRegular}');
  }
  @font-face {
    font-family: FDLight;
    src: url('${fdLight}');
  }
  @font-face {
    font-family: RobotoThin;
    src: url('${robotoThin}');
  }

  p {
    width: fit-content;
    margin: 0 auto 1.4vh auto;
    padding-bottom: 1vh;
    font-size: 2.6vh;
    cursor: pointer;
  }

  p.selected{
    border-bottom: solid 1px #FFF;
    padding-bottom: calc(1vh - 1px);
  }
`;

ReactDOM.render(<App />, document.getElementById('root'));
