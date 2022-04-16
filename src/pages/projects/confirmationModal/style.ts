import styled from "styled-components";

import { whiteGrey } from "../../../styles/variables";

export const Section_Heading = styled.h3`
  display: flex;
  align-items: center;
`;

export const Modal_Header = styled.header`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid ${whiteGrey};
  padding: 1.5rem;
`;

export const Modal_Section = styled.section`
  display: flex;
  justify-content: space-evenly;
  padding: 1.5rem;
`;

export const Icon_Link = styled.a`
  cursor: pointer;
  display: flex;
  padding: 0.3rem;
`;

export const styles = {
  content: {
    top: "30%",
    left: "50%",
    right: "initial",
    bottom: "initial",
    transform: "translate(-50%, -50%)",
    width: "35rem",
    overflow: "hidden",
  },
};
