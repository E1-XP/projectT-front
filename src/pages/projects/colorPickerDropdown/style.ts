import styled from "styled-components";

import { greyWhite, white, whiteGrey } from "../../../styles/variables";

export const Color_Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 140px;
  position: absolute;
  z-index: 90;
  padding: 0.5rem;
  border: 1px solid ${greyWhite};
`;

export const Color_Indicator = styled.div`
  padding: 0.5rem;
  width: 1.5rem;
  background-color: ${(props) => props.color};
`;

export const Color_Indicator_Multi = styled(Color_Indicator)`
  margin: 0.2rem;
  height: 1.5rem;
  position: relative;
  cursor: pointer;
`;

export const Color_Indicator_Inner = styled.span`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  margin: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

export const Screen_Blocker = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
  z-index: 50;
`;
