import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './actions';

import styledNormalize from 'styled-normalize';
import styled, { injectGlobal } from 'styled-components';
import reset from './styles/reset';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Preloader from './components/preloader';
import Protected_container from './components/protected';
import Sidebar from './components/sidebar';
import Timer from './containers/timer';
import Dashboard from './components/dashboard';
import Profile from './components/profile';
import Form from './components/form';
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
        const url = `http://localhost:3001/auth/refresh`;
        const sessionData = sessionStorage.getItem('session');
        const isAuth = localStorage.getItem('isAuth');

        if (isAuth) fetchAuthentication(url, true);

        // this.setPreviouslyRunningTimer(res.data);
        else setIsLoading(false);
    }

    handleAuthForm(data) {

        sessionStorage.setItem('session', JSON.stringify(data));
        localStorage.setItem('isAuth', true);

        // setTimeout(() => this.setPreviouslyRunningTimer(this.state.userData), 1000);
        this.handleAuth();
        return <Redirect to="/timer" />;
    }

    handleLogout() {
        const { fetchAuthentication } = this.props;
        const url = `http://localhost:3001/auth/logout`;

        fetchAuthentication(url, false);

        sessionStorage.removeItem('session');
        localStorage.removeItem('isAuth');
    }

    render() {
        resetCSS();
        return (
            <Router>
                <App_container>
                    <Preloader isLoading={this.props.isLoading}>
                        <Route path="/signup" render={() => (<Form handleAuth={this.handleAuthForm.bind(this)} />)} />
                        <Route path="/login" render={() => (<Form handleAuth={this.handleAuthForm.bind(this)} />)} />
                        <Protected_container isAuthenticated={this.props.isUserLoggedIn}>
                            <Sidebar />
                            <Main_content>
                                <Switch>
                                    <Route exact path="/" render={() => (<Redirect to="/timer" />)} />
                                    <Route path="/timer" component={Timer} />
                                    <Route path="/dashboard" component={Dashboard} />
                                    <Route path="/profile" render={() => (<Profile handleLogout={this.handleLogout.bind(this)} />)} />
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
    fetchAuthentication: (url, flag) => dispatch(actions.fetchAuthentication(url, flag))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);