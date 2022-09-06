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
        font-size: 87.5%;
        height: 100%;
    
        ${getBP(breakPoints.large)} {
            font-size: 75%;
        }
    
        ${getBP(breakPoints.verySmall)} {
            font-size: 68.8%;
        }

        ${getBP("370px", "min")} and (orientation:portrait) {
            overflow:hidden;
        }
    }

    body {
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        background-color: ${white};
        height: 100%;

        
        ${getBP("370px")} {
            min-width: 370px;
            height: 100vh;
        }

    }

    .root {
        height:100%;

        ${getBP(breakPoints.verySmall)} {
            height: calc(100% - 54px);
         }
    }

    ${libraryStyles}

    input[type="file"].inputfile-hidden {
    display: none;
}

input[type=checkbox]:not(old) {
    width: 2em;
    margin: 0;
    padding: 0;
    font-size: 1em;
    opacity: 0;
}

input[type=checkbox]:not(old)+label {
    display: inline-block;
    margin-left: -2em;
    line-height: 1.5em;
}

input[type=checkbox]:not(old)+label>span {
    display: inline-block;
    width: 0.875em;
    height: 0.875em;
    margin: 0.25em 0.5em 0.25em 0.25em;
    border: 0.0625em solid rgb(192, 192, 192);
    border-radius: 0.25em;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
    background: #fff;
    vertical-align: bottom;
}

input[type=checkbox]:not(old):checked+label>span {
    background: #fff;
}

input[type=checkbox]:not(old):checked+label>span:before {
    content: '✓';
    display: block;
    width: 1em;
    color: #47be00;
    font-size: 0.875em;
    line-height: 1em;
    text-align: center;
    font-weight: bold;
}

::-webkit-scrollbar {
    width:6px;
}

::-webkit-scrollbar:horizontal {
    height:6px;
}

::-webkit-scrollbar-thumb {
    background:#e20505;
}
`;
