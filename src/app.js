import React from 'react';
import styledNormalize from 'styled-normalize';
import styled, { injectGlobal } from 'styled-components';

const resetCSS = () => injectGlobal`
${styledNormalize}
* {
    box-sizing: border-box;
}

ul,
ol {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

a {
    text-decoration: none;
    color: inherit;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
    margin: 0;
}

@import url('https://fonts.googleapis.com/css?family=Open+Sans');

body{
    font-family: 'Open Sans', sans-serif;
}
`

const App_container = styled.div`
display:flex;
width:100vw;
height:100vh;
`

class App extends React.Component {
    render() {
        resetCSS();
        return (
            <App_container>
                <h1>App</h1>
            </App_container>
        );
    }
}

export default App;