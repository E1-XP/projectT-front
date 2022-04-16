import styled, { keyframes } from "styled-components";
import { greyWhiteDarker, white } from "../../../styles/variables";

export const Wrapper = styled.section`
  margin-top: 1rem;
  width: 100%;
  height: 350px;
  position: relative;

  & .recharts-wrapper {
    box-shadow: 0 1px 3px rgba(128, 128, 128, 0.2);
    height: 281px !important;
    border-bottom: 2px solid ${greyWhiteDarker};
    background-color: ${white};
  }

  .recharts-surface {
    overflow: visible;
  }
`;
