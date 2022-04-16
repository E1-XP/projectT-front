import React, { PropsWithChildren } from "react";
import styled, { CSSProperties } from "styled-components";

import { Spinner } from "./loader";
import { darkGrey, green, greyWhite, red, white } from "../styles/variables";

export const Button = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 3px;
  padding: 1rem;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.2s ease-in;
  background-color: ${darkGrey};
  color: ${white};
  min-width: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;

  & > span {
    margin-right: 0.5rem;
  }

  &:disabled {
    color: ${darkGrey};
    background: ${greyWhite};
    cursor: not-allowed;

    & > span {
      color: ${darkGrey} !important;
    }

    &:hover {
      color: ${darkGrey};
      background: ${greyWhite};
    }
  }
`;

export const Button_Success = styled(Button)`
  background-color: ${green};

  &:hover {
    background-color: #3fa900;
  }
`;

export const Button_Danger = styled(Button)`
  background-color: ${red};

  &:hover {
    background-color: #c20000;
  }
`;

interface ButtonActionProps {
  isLoading?: boolean;
  style?: CSSProperties;
}

const Btn_Action = styled.button`
  padding: 0.8rem 0.5rem;
  background-color: ${red};
  cursor: pointer;
  border: none;
  margin: none;
  color: ${white};
  border-radius: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.75rem;

  &:hover {
    opacity: 0.8;
  }
`;

export const Button_Action = ({
  isLoading = false,
  style,
  children,
}: PropsWithChildren<ButtonActionProps>) => (
  <Btn_Action style={style}>
    {isLoading ? <Spinner fill={white} /> : children}
  </Btn_Action>
);
