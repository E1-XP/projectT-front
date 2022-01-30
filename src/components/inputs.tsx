import React from "react";
import styled from "styled-components";
import { greyWhiteDarker, red } from "../styles/variables";

export interface InputProps {
  isValid: boolean;
}

export const Input = styled.input`
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1.5px solid
    ${(props: InputProps) => (props.isValid ? greyWhiteDarker : red)};
  border-radius: 0.3rem;
`;
