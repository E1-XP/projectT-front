import { createGlobalStyle } from "styled-components";
import styledNormalize from "styled-normalize";

import { reset } from "./reset";
import { getBP } from "./helpers";
import { breakPoints, white } from "./variables";
import { libraryStyles } from "./library";

interface IGlobalStyle {
  isUserLoggedIn: boolean;
}

export const GlobalStyle = createGlobalStyle`
    ${styledNormalize}
    ${reset}

    html {
        ${getBP(breakPoints.veryLarge)} {
            font-size: 87.5%;
        }

        ${getBP(breakPoints.large)} {
            font-size: 75%;
        }
    
        ${getBP(breakPoints.verySmall)} {
            font-size: 62.5%;
        }
  
        height: 100%;
    }

    body {     
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        background-color: ${white};
        height: 100%;
    }

    .root {
        ${(props: IGlobalStyle) =>
          props.isUserLoggedIn &&
          `display: flex;
           height: 100%;`}

        ${getBP(breakPoints.verySmall)} {
            flex-direction: column-reverse;
            justify-content: space-between;
         }
    }

    ${libraryStyles}
`;
