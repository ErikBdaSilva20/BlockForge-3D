import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background-color: #1a1a1a;
    color: #ffffff;
    overflow: hidden; /* Since it's a full-screen application */
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  #root {
    width: 100vw;
    height: 100vh;
  }
`;
