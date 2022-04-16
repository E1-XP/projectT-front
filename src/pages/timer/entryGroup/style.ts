import styled from "styled-components";
import { whiteGrey } from "../../../styles/variables";

export const Project_Item = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin: auto 0;
  align-items: center;

  &:hover {
    background-color: ${whiteGrey};
  }
`;

export const Entry_List = styled.ul`
  width: 100%;
`;
