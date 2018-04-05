import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';

import Preloader from './containers/preloader';
import Protected_container from './containers/protected';
import Sidebar from './components/sidebar';
import Timer from './containers/timer';
import Dashboard from './containers/dashboard';
import Projects from './containers/projects';
import Profile from './containers/profile';
import Form from './containers/form';
import NotFound from './components/404';

const App_container = styled.div`
    display:flex;
    height:100vh;
`
const Main_content = styled.main`
    display:flex;
    flex-direction:column;
    width:95%;
    margin-left:52px;
    @media only screen and (min-width:1200px){
        margin-left:171px;
        width:91%;
    }
`;

const routes = (<App_container>
    <Preloader >
        <Route path="/signup" component={Form} />
        <Route path="/login" component={Form} />
        <Protected_container >
            <Sidebar />
            <Main_content>
                <Switch>
                    <Route exact path="/" render={() => (<Redirect to="/timer" />)} />
                    <Route path="/timer" component={Timer} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/projects" component={Projects} />
                    <Route path="/profile" component={Profile} />
                    <Route component={NotFound} />
                </Switch>
            </Main_content>
        </Protected_container>
    </Preloader>
</App_container>);

export default routes;