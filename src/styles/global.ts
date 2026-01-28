import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
    height: 100%;

  @media (max-width: 1300px) {
    font-size: 93.75%; /* 15px */
  }

  @media (max-width: 992px) {
    font-size: 87.5%; /* 14px */
  }

  @media (max-width: 768px) {
    font-size: 87.5%; /* mantém 14px */
  }

  @media (max-width: 576px) {
    font-size: 87.5%; /* mantém 14px */
  }

    scrollbar-width: thin;
    scrollbar-color: 
    ${({ theme }) => theme.highlight} ${({ theme }) => theme.background};

    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }

    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.background};
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.highlight};
      border-radius:4px;
      border: 1px solid ${({ theme }) => theme.background};
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: ${({ theme }) => theme.primary};
    }

    &::-webkit-scrollbar-thumb:active {
      background-color: ${({ theme }) => theme.secondary};
    }
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    height: 100%;

    @media screen and (max-width: 768px) {
      overflow-y: auto;
    }
  }

  button {
    cursor: pointer;
    transition: .5s all;
    font-family: 'Asap', sans-serif;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.highlight};
  }

  input:focus,
  select:focus {
    outline: none;
    box-shadow: none;
    border-color: #ccc; /* ajuste para sua cor */
  }
`;
