import React from "react";
import {
  Wrapper,
  Header,
  Heading,
  Main_Content,
  Section,
  Figure,
  Decoration_Image,
  Info_Paragraph,
} from "./style";

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
