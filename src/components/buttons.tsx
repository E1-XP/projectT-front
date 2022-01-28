import React from "react";
import styled from "styled-components";

import { darkGrey, green, greyWhite, red, white } from "../styles/variables";

const Button = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 3px;
  padding: 1rem;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.2s ease-in;
  color: ${white};
  min-width: 8rem;

  &:disabled {
    color: ${darkGrey};
    background: ${greyWhite};
    cursor: not-allowed;

    &:hover {
      color: ${darkGrey};
      background: ${greyWhite};
    }
  }
`;

export const Button_create = styled(Button)`
  background-color: ${green};

  &:hover {
    background-color: #3fa900;
  }
`;

export const Button_remove = styled(Button)`
  background-color: ${red};

  &:hover {
    background-color: #c20000;
  }
`;

export const Button_action = styled.button`
  padding: 0.8rem 0.5rem;
  background-color: ${red};
  cursor: pointer;
  border: none;
  margin: none;
  color: ${white};
  border-radius: 0.3rem;

  &:hover {
    opacity: 0.8;
  }
`;
