import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import styledNormalize from 'styled-normalize';
import styled, { injectGlobal } from 'styled-components';

import Preloader from './components/preloader';
import Protected_container from './components/protected';
import Sidebar from './components/sidebar';
import Timer from './components/timer';
import Dashboard from './components/dashboard';
import Profile from './components/profile';
import Form from './components/form';
import NotFound from './components/404';

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
const Main_content = styled.main`
display:flex;
flex-direction:column;
width:100%;
`;

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            isUserLoggedIn: false,
            userData: {}
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 2000);
    }

    handleLogin(e) {
        this.setState({ isUserLoggedIn: true });
    }

    render() {
        resetCSS();
        return (
            <Router>
                <App_container>
                    <Preloader isLoading={this.state.isLoading}>
                        <Route path="/signup" component={Form} />
                        <Route path="/login" component={Form} />
                        <Protected_container isAuthenticated={this.state.isUserLoggedIn}>
                            <Sidebar />
                            <Main_content>
                                <Switch>
                                    <Route exact path="/" render={() => (<Redirect to="/timer" />)} />
                                    <Route path="/timer" component={Timer} />
                                    <Route path="/dashboard" component={Dashboard} />
                                    <Route path="/profile" component={Profile} />
                                    <Route component={NotFound} />
                                </Switch>
                            </Main_content>
                        </Protected_container>
                    </Preloader>
                </App_container>
            </Router>
        );
    }
}

export default App;