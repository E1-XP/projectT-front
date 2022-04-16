import React from "react";
import styled from "styled-components";

import { breakPoints } from "../../styles/variables";
import { getBP } from "../../styles/helpers";
import { Heading as HeadingCSS, Paragraph } from "./../../styles/typography";

const Wrapper = styled.main`
  width: 100%;
  max-width: ${breakPoints.large};
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h2`
  ${HeadingCSS}
`;

const Main_Content = styled.section`
  display: flex;
  margin-top: 4rem;

  ${getBP(breakPoints.medium)} {
    flex-direction: column;
  }
`;

const Section = styled.section`
  flex: 1 1 50%;
`;

const Decoration_Image = styled.img`
  display: block;
  user-select: none;
  -webkit-user-drag: none;

  ${getBP(breakPoints.small)} {
    width: 80%;
  }
`;

const Figure = styled.figure`
  width: 50%;
  margin: 4rem auto;

  & img {
    width: 100%;
  }

  & figcaption {
    margin-top: 0.5rem;
    text-align: center;
    font-size: 0.8rem;
  }
`;

const Info_Paragraph = styled.p`
  ${Paragraph}

  text-align: justify;
  max-width: 80%;
  margin: 0 auto;
`;

export const ErrorPage = () => {
  return (
    <Wrapper>
      <Header>
        <Heading>Error Page</Heading>
      </Header>
      <Main_Content>
        <Section>
          <Figure>
            <Decoration_Image
              src={require("./../../../public/assets/error-page.svg").default}
            />
            <figcaption>
              <a href="https://www.freepik.com/vectors/technology">
                Technology vector created by macrovector - www.freepik.com
              </a>
            </figcaption>
          </Figure>
          <Info_Paragraph>
            Something really bad happened and application crashed. We are
            already working to fix it. Please refresh page in a few minutes.
          </Info_Paragraph>
        </Section>
      </Main_Content>
    </Wrapper>
  );
};

export default ErrorPage;
