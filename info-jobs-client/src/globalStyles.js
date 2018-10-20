import { createGlobalStyle } from 'styled-components';
import { lightGrey } from './styles/colors';

export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    font-family: 'Montserrat', sans-serif !important;
  }
  body {
    height: 100%;
    background-color: ${lightGrey};

    #root {
      height: 100%;
    }
  }
`;
