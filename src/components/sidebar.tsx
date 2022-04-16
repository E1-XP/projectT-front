import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

import { ProfileDropdown } from "./profileDropdown";
import { Icon } from "./../components/icon";
import { getBP } from "../styles/helpers";
import {
  breakPoints,
  darkGrey,
  greyWhite,
  white,
  red,
} from "../styles/variables";
import { useStoreSelector } from "../hooks";
import { selectGlobal } from "../selectors";

const Wrapper = styled.aside`
  color: ${white};
  background-color: ${darkGrey};
  box-shadow: 4px 0px 5px rgba(0, 0, 0, 0.2);
  max-width: 3.25rem;
  padding: 1rem;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: fixed;
  z-index: 999;
  top: 0;

  ${getBP(breakPoints.medium, "min")} {
    max-width: 15.62rem;
  }

  ${getBP(breakPoints.verySmall)} {
    flex-direction: row;
    justify-content: space-evenly;
    max-width: initial;
    height: initial;
    width: 100%;
    bottom: 0;
    top: initial;
    padding-top: 1rem;
  }

  & ~ main {
    padding-left: 9.326rem;

    ${getBP(breakPoints.medium)} {
      padding-left: 4.25rem;
    }

    ${getBP(breakPoints.verySmall)} {
      padding-left: 1rem;
      padding-bottom: 5.4rem;
    }

    ${getBP("370px")} {
      overflow-y: initial;
      height: initial;
    }
  }
`;

const Sidebar_Profile = styled.section`
  ${getBP(breakPoints.verySmall, "min")} {
    margin-top: auto;
  }
`;

const Sidebar_Header = styled.header`
  ${getBP(breakPoints.verySmall)} {
    font-size: 1.4rem;
  }
`;

const Sidebar_Navigation = styled.nav`
  ${getBP(breakPoints.verySmall, "min")} {
    margin-top: 1rem;
  }
`;

const Navigation_Link = styled(NavLink)`
  color: ${greyWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 7px;
  position: relative;
  border: 1px solid transparent;

  ${getBP(breakPoints.medium, "min")} {
    justify-content: initial;
  }

  &:hover {
    color: ${white};
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid
      ${({ $isFetching }: { $isFetching?: boolean }) =>
        $isFetching ? red : "rgba(255, 255, 255, 0.2)"};
  }
`;

const Header = styled.h1`
  font-size: inherit;
  font-family: "Open Sans", sans-serif;
`;

const Header_Link = styled(Link)`
  color: ${greyWhite};
  display: flex;
  align-items: center;

  &:hover {
    color: ${white};
  }
`;

const Link_Label = styled.span`
  display: none;

  ${getBP(breakPoints.verySmall)} {
    display: block;
    margin-left: 1rem;

    &:first-of-type {
      margin: 0;
    }
  }

  ${getBP(breakPoints.medium, "min")} {
    display: block;
    margin-left: 1rem;

    &:first-of-type {
      margin: 0;
    }
  }
`;

const Navigation_List = styled.ul`
  ${getBP(breakPoints.verySmall)} {
    display: flex;
  }
`;

const Navigation_Item = styled.li`
  margin: 0.1rem;
`;

export const Sidebar = () => {
  const { isFetching } = useStoreSelector(selectGlobal);

  return (
    <Wrapper>
      <Sidebar_Header>
        <Header>
          <Header_Link to="/timer">
            <Link_Label>Project</Link_Label>T
          </Header_Link>
        </Header>
      </Sidebar_Header>
      <Sidebar_Navigation>
        <Navigation_List>
          <Navigation_Item>
            <Navigation_Link
              to="/timer"
              $isFetching={isFetching}
              activeClassName="active"
            >
              <Icon name="access_time" />
              <Link_Label>Timer</Link_Label>
            </Navigation_Link>
          </Navigation_Item>
          <Navigation_Item>
            <Navigation_Link
              to="/reports"
              $isFetching={isFetching}
              activeClassName="active"
            >
              <Icon name="bar_chart" />
              <Link_Label>Reports</Link_Label>
            </Navigation_Link>
          </Navigation_Item>
          <Navigation_Item>
            <Navigation_Link
              to="/projects"
              $isFetching={isFetching}
              activeClassName="active"
            >
              <Icon name="folder" />
              <Link_Label>Projects</Link_Label>
            </Navigation_Link>
          </Navigation_Item>
        </Navigation_List>
      </Sidebar_Navigation>
      <Sidebar_Profile>
        <ProfileDropdown />
      </Sidebar_Profile>
    </Wrapper>
  );
};
