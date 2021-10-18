import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  width: 7rem;
  justify-content: space-between;
`;

const Logo = styled.h1``;

export const NavBar = () => {
  return (
    <Header>
      <Logo>
        <NavLink to="/">ProjectT</NavLink>
      </Logo>
      <Navigation>
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </Navigation>
    </Header>
  );
};
