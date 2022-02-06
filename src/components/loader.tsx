import React, { PropsWithChildren } from "react";
import styled, { keyframes } from "styled-components";

import { useStoreSelector } from "../hooks";
import {
  darkGrey,
  greyWhite,
  greyWhiteDarker,
  red,
  white,
} from "../styles/variables";

const rotateAnim = keyframes`
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  transition: all 0.4s linear;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  color: ${greyWhiteDarker};
  font-size: 1.125rem;
  opacity: ${(props: { isVisible: boolean }) => (props.isVisible ? 1 : 0)};
  pointer-events: none;
`;

interface SpinnerProps {
  showBigSpinner?: boolean;
  fill: string;
}
export const Spinner = styled.div`
  width: ${(props: SpinnerProps) =>
    props.showBigSpinner ? "3.125rem" : "initital"};
  height: ${(props: SpinnerProps) =>
    props.showBigSpinner ? "3.125rem" : "initital"};
  padding: 0.6rem;
  border: 3px solid ${({ fill }: SpinnerProps) => fill};
  border-right: 3px solid transparent;
  border-radius: 50%;
  transform: translateZ(0);
  animation: ${rotateAnim} 0.5s linear infinite;
`;

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

  & ${Spinner} {
    margin-top: 1rem;
  }
`;

interface ComponentLoaderProps {
  isVisible: boolean;
  shouldShowSpinner: boolean;
  shouldShowMessage: boolean;
  message: string;
  fill?: string;
}

export const ComponentLoader = ({
  isVisible,
  shouldShowSpinner,
  shouldShowMessage,
  message,
  fill,
}: ComponentLoaderProps) => {
  return (
    <Overlay isVisible={isVisible}>
      {shouldShowSpinner ? (
        <Spinner fill={fill || greyWhite} showBigSpinner={true} />
      ) : shouldShowMessage ? (
        message
      ) : (
        ""
      )}
    </Overlay>
  );
};

export const Loader = (props: PropsWithChildren<{}>) => {
  const isLoading = useStoreSelector((state) => state.global.isLoading);

  return isLoading ? (
    <Main_preloader>
      <h1>ProjectT</h1>
      <Spinner fill={red} />
    </Main_preloader>
  ) : (
    <> {props.children}</>
  );
};
