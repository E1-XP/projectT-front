import styled from "styled-components";

import { IModalError, CAPTION_STATES } from ".";
import { red, white, whiteGrey, green } from "../../../styles/variables";

export const Section_Heading = styled.h3`
  font-weight: 500;
  display: flex;
  align-items: center;
`;

export const Icon_Link = styled.a`
  cursor: pointer;
  display: flex;
  padding: 0.3rem;
`;

export const Modal_Header = styled.header`
  padding: 1.5rem;
  padding-left: 2rem;
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  border-bottom: 1px solid ${whiteGrey};
`;

export const Modal_Content = styled.section`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

export const Modal_Caption = styled.div`
  padding: 1rem;
  background-color: ${({ isVisible, type }: IModalError) =>
    isVisible ? (type === CAPTION_STATES.ERROR ? red : green) : white};
  color: ${white};
  font-weight: 700;
  text-align: center;
  transition: all 200ms ease-in-out;
`;

export const Button_Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0rem;
`;

export const modalStyle = {
  overlay: {},
  content: {
    width: "34.375rem",
    margin: "0 auto",
    padding: "0",
    boxShadow: `0 5px 15px rgba(128,128,128,0.5)`,
    overflow: "hidden",
    left: "50%",
    right: "50%",
    top: "initial",
    bottom: "initial",
    transform: "translate(-50%, 30%)",
  },
};
