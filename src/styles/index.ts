import { createGlobalStyle } from "styled-components";
import styledNormalize from "styled-normalize";

import { reset } from "./reset";
import { getBP } from "./helpers";
import { breakPoints, white } from "./variables";
import { libraryStyles } from "./library";

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
        height:100%;

        ${getBP(breakPoints.verySmall)} {
            height: calc(100% - 54px);
         }

        & main {
           padding-left: 9.612rem;

            ${getBP(breakPoints.medium)} {
                padding-left: 4.25rem;
            }

            ${getBP(breakPoints.verySmall)} {
                padding-bottom: 5.4rem;
                padding-left: 1rem;
            }
        }
    }

    ${libraryStyles}
`;
