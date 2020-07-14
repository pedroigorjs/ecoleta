import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    color: #6C6C80;
    background-color: #F0F0F5;
    -webkit-font-smoothing: antialiased;
  }

  body,
  html,
  #root {
    height: 100%;
  }

  body,
  button,
  input {
    font: 16px Roboto, sans-serif;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #322153;
    font-family: Ubuntu;
  }

`;
