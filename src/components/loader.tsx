import React, { PropsWithChildren } from "react";
import styled, { keyframes } from "styled-components";

import { useStoreSelector } from "../hooks";
import { darkGrey, white } from "../styles/variables";

const Main_preloader = styled.div`
  background-color: ${darkGrey};
  color: ${white};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  height: 100vh;
`;

const rotateAnim = keyframes`
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
`;

const Spinner = styled.div`
  margin-top: 1rem;
  padding: 0.6rem;
  border: 3px solid red;
  border-right: 3px solid transparent;
  border-radius: 50%;
  transform: translateZ(0);
  animation: ${rotateAnim} 0.5s linear infinite;
`;

export const Loader = (props: PropsWithChildren<{}>) => {
  const isLoading = useStoreSelector((state) => state.global.isLoading);

  return isLoading ? (
    <Main_preloader>
      <h1>ProjectT</h1>
      <Spinner />
    </Main_preloader>
  ) : (
    <> {props.children}</>
  );
};
