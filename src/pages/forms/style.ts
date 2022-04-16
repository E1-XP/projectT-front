import styled from "styled-components";

import { greyWhiteDarker, red } from "../../styles/variables";
import { visuallyHidden } from "../../styles/helpers";

export const Heading = styled.h2`
  padding: 2rem 0.2rem;
  text-align: center;
  font-size: 1.7rem;
  font-weight: 500; ;
`;

export const HiddenLabel = styled.label`
  ${visuallyHidden}
`;

export const Main = styled.main`
  width: 31rem;
  margin: 0 auto;
  margin-top: 6rem;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;

  & > input {
    width: 100%;
  }
`;

export const ErrorParagraph = styled.p`
  color: ${red};
  padding: 2rem;
  text-align: center;
`;
