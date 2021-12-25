import React, { useState } from "react";
import styled from "styled-components";
import { Icon } from "../../components/icon";

import {
  breakPoints,
  darkGrey,
  greyWhite,
  whiteGrey,
} from "../../styles/variables";
import { getBP } from "./../../styles/helpers";

const Wrapper = styled.div`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h2`
  font-size: 2.125rem;
  font-weight: 500;
`;

const Heading_section = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  position: relative;
`;

const Chart_section = styled.section`
  flex-basis: 72%;
  width: 0;
  min-width: 36.875rem;
  margin-right: 1rem;

  ${getBP("56.25rem")} {
    flex-basis: 100%;
  }
`;

const Item_link = styled.a`
  color: ${darkGrey};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Item_link_border = styled(Item_link)`
  border-right: 1px solid ${whiteGrey};
  & span {
    width: 1.5rem;
    color: ${greyWhite};
  }
  &:hover span {
    color: ${darkGrey} !important;
  }
`;

const Item_link_hover = styled(Item_link)`
  color: ${greyWhite};

  &:hover {
    color: ${darkGrey};
  }
`;

const Period_selection = styled.div`
  display: flex;
`;

const Screen_blocker = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
  z-index: 50;
`;

export const Reports = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <Wrapper>
      <Chart_section>
        <Header>
          <Heading>Reports</Heading>
          <Heading_section>
            <Item_link_border>
              <Icon
                name={isCalendarOpen ? "close" : "arrow_drop_down"}
                fill={isCalendarOpen ? darkGrey : greyWhite}
                size={isCalendarOpen ? "18px" : "24px"}
              />
            </Item_link_border>
            <Period_selection>
              <Item_link_hover>
                <Icon name="keyboard_arrow_left" />
              </Item_link_hover>
              <Item_link_hover>
                <Icon name="keyboard_arrow_right" />
              </Item_link_hover>
            </Period_selection>
            {isCalendarOpen && <Screen_blocker />}
          </Heading_section>
        </Header>
      </Chart_section>
    </Wrapper>
  );
};
