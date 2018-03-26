import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './actions';

import styledNormalize from 'styled-normalize';
import styled, { injectGlobal } from 'styled-components';
import reset from './styles/reset';

import Preloader from './components/preloader';
import Protected_container from './components/protected';
import Sidebar from './components/sidebar';
import Timer from './containers/timer';
import Dashboard from './containers/dashboard';
import Profile from './containers/profile';
import Form from './containers/form';
import NotFound from './components/404';

const resetCSS = () => injectGlobal`
${styledNormalize}
${reset}
`

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

class App extends React.Component {
    componentDidMount() {
        this.handleAuth();
    }

    handleAuth() {
        const { fetchAuthentication, setIsLoading } = this.props;
        const sessionData = sessionStorage.getItem('session');
        const isAuth = localStorage.getItem('isAuth');

        if (isAuth) fetchAuthentication();
        else {
           // <Redirect to="/login" />;
            setIsLoading(false);
        };
    }

    render() {
        resetCSS();
        return (
            <Router>
                <App_container>
                    <Preloader isLoading={this.props.isLoading}>
                        <Route path="/signup" component={Form} />
                        <Route path="/login" component={Form} />
                        <Protected_container isAuthenticated={this.props.isUserLoggedIn}>
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

const mapStateToProps = ({ isLoading, isUserLoggedIn }) => ({
    isLoading,
    isUserLoggedIn
});

const mapDispatchToProps = dispatch => ({
    setIsLoading: v => dispatch(actions.setIsLoading(v)),
    fetchAuthentication: () => dispatch(actions.fetchAuthentication()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);