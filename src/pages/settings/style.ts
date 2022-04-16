import styled from "styled-components";

import { breakPoints, darkGrey, red, white } from "../../styles/variables";
import { getBP } from "../../styles/helpers";
import { Heading as HeadingCSS } from "./../../styles/typography";

import { Button } from "../../components/buttons";
import { Input } from "../../components/inputs";

export const Wrapper = styled.main`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

export const Heading = styled.h2`
  ${HeadingCSS}
`;

export const Main_Content = styled.section`
  display: flex;
  margin-top: 4rem;

  ${getBP(breakPoints.medium)} {
    flex-direction: column;
  }
`;

export const Button_Bar = styled.div`
  display: flex;
`;

export const Button_Password = styled(Button)`
  background-color: ${darkGrey};
  margin-right: 0.7rem;

  &:hover {
    background-color: #2a2a2a;
  }
`;

export const Side = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Settings_Section = styled.section`
  flex: 1 1 50%;
`;

export const Form_Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 35rem;
  margin: 0 auto;

  ${getBP(breakPoints.medium)} {
    margin-top: 4rem;
  }
`;

export const Label = styled.label`
  font-weight: 500;
`;

export const Input_Label = styled(Input)`
  margin-bottom: 1rem;
`;

export const Input_Group = styled.div`
  display: flex;
  padding: 0.3rem;
  padding-top: 6rem;
`;

export const Label_Check = styled.label`
  float: left;
  margin-left: 1rem;
`;

export const Form_Message = styled.p`
  color: ${red};
  text-align: center;
`;
