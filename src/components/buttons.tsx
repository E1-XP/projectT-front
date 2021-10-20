import React from "react";
import styled from "styled-components";

import { red } from "../styles/variables";

export const ActionButton = styled.button`
  padding: 0.8rem 0.5rem;
  background-color: ${red};
  cursor: pointer;
  border: none;
  margin: none;
  color: white;
  border-radius: 0.3rem;

  &:hover {
    opacity: 0.8;
  }
`;
