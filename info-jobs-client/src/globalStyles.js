import { createGlobalStyle } from 'styled-components';
import { lightGrey } from './styles/colors';

export const GlobalStyle = createGlobalStyle`
  html {
    min-height: 100%;
    width: 100%;
    font-family: 'Montserrat', sans-serif !important;
  }
  body {
    min-height: 100%;
    width: 100%;
    overflow-x: hidden;
    margin: 0;
    background-color: ${lightGrey};

    #root {
      width: 100%;
      min-height: 100%;
    }
  }
`;
