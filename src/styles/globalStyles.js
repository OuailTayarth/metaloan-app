import styled from "styled-components";

export const Main = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #ffff;
  transition: opacity 1s ease;
`;

export const title = styled.h1`
  font-size: 3rem;
  padding-bottom: 15px;
`;

export const Button = styled.button`
  font-family: inherit;
  height: 50px;
  width: 175px;
  background-color: #fff;
  border: none;
  color: #000;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-weight: 700;
  font-size: 16px;
  margin-top: 10px;
  &:hover {
    background-color: #dce7ff;
    letter-spacing: 2px;
  }
`;
