import { createGlobalStyle } from "styled-components";
import styledNormalize from "styled-normalize";

import { reset } from "./reset";
import { getBP } from "./helpers";
import { breakPoints, white } from "./variables";

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
    }

    body {     
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        background-color: ${white};
    }
`;
