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
  justify-content: center;
  padding: 1.5rem;
`;

export const Modal_Footer = styled.footer`
  display: flex;
  padding: 1.5rem;
  justify-content: flex-end;
`;

export const Relative_Container = styled.div`
  position: relative;
`;

export const Icon_Link = styled.a`
  cursor: pointer;
  display: flex;
  padding: 0.3rem;
`;

export const Icon_Link_Modal = styled(Icon_Link)`
  border: 1px solid #ccc;
  position: relative;
  padding: 0.5rem;
`;

export const Input = styled.input`
  border: 1px solid #bbb;
  padding: 0.5rem;
`;

export const Color_Indicator = styled.div`
  padding: 0.5rem;
  width: 1.5rem;
  background-color: ${(props) => props.color};
`;

export const colors = [
  `#1abc9c`,
  `#3498db`,
  "#34495e",
  `#e74c3c`,
  `#d35400`,
  `#f1c40f`,
  `#95a5a6`,
  `#8e44ad`,
];

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
