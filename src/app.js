import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import styledNormalize from 'styled-normalize';
import styled, { injectGlobal } from 'styled-components';
import axios from 'axios';
axios.defaults.withCredentials = true;

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

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
    constructor() {
        super();

        this.state = {
            isLoading: true,
            isUserLoggedIn: false,
            userData: {},
            isRunning: false,
            timer: '0:00:00',
            runningEntry: null
        }
    }

    componentDidMount() {
        this.handleAuth();
    }

    handleAuth() {
        const url = `http://localhost:3001/auth/refresh`;
        const sessionData = sessionStorage.getItem('session');
        const isAuthenticated = localStorage.getItem('isAuth');
        console.log('got called!');

        if (isAuthenticated) axios.post(url).then(res => {
            console.log(res);

            if (res.status === 200) {
                (isAuthenticated) ? this.setState({ userData: res.data, isLoading: false, isUserLoggedIn: true }) : this.setState({ isLoading: false });
                //resume playing timer
                this.setPreviouslyRunningTimer(res.data);
            }

        }).catch(err => console.log(err));

        else this.setState({ isLoading: false });
    }

    handleAuthForm(data) {
        this.setState({ isUserLoggedIn: true });
        sessionStorage.setItem('session', JSON.stringify(data));
        localStorage.setItem('isAuth', true);

        // setTimeout(() => this.setPreviouslyRunningTimer(this.state.userData), 1000);
        this.handleAuth();
        return <Redirect to="/timer" />;
        //preauth is called every time 
    }

    handleLogout() {
        const url = `http://localhost:3001/auth/logout`;

        axios.post(url).then(res => {
            console.log(res);
        }).catch(err => console.log(err));

        sessionStorage.removeItem('session');
        localStorage.removeItem('isAuth');
        this.setState({ isUserLoggedIn: false });
    }

    handleClick() {
        const { isRunning, userData } = this.state;
        const url = `http://localhost:3001/users/${userData._id}/entries/new`;
        const start = moment().format();

        if (!isRunning) {
            this.setState({ isRunning: true });

            axios.post(url).then(res => {
                this.setState({ runningEntry: res.data._id });
            }).catch(err => console.log(err));

            window.interval = setInterval(() => this.setState({
                timer: moment.duration(moment().diff(start)).format('h:mm:ss', { stopTrim: "hh mm ss" })
            }), 500);
        }
        else this.stopTimer();
        //make a post request with starting/stopping timestamp
    }

    setPreviouslyRunningTimer(dataSrc) {
        if (dataSrc.entries.filter(item => item.stop === undefined).length) {
            const runEntry = dataSrc.entries.filter(item => item.stop === undefined)[0];
            this.setState({ runningEntry: runEntry._id });

            const start = moment(runEntry.start).format();

            clearInterval(window.interval);
            window.interval = setInterval(() =>
                this.setState({
                    isRunning: true,
                    timer: moment.duration(moment().diff(start)).format('h:mm:ss', { stopTrim: "hh mm ss" })
                }), 500)
        }
    }

    stopTimer() {
        const { userData, runningEntry } = this.state;

        clearInterval(window.interval);
        this.setState({ isRunning: false, timer: '0:00:00' });

        //make request to fill stop field in db 
        const url = `http://localhost:3001/users/${userData._id}/entries/${runningEntry}/update?stop=${moment().valueOf()}`;

        axios.post(url).then(res => {
            console.log(res);
        }).catch(err => console.log(err));
        //update view with entries
    }

    deleteEntry(id) {
        alert(id);
    }

    render() {
        resetCSS();
        return (
            <Router>
                <App_container>
                    <Preloader isLoading={this.state.isLoading}>
                        <Route path="/signup" render={() => (<Form handleAuth={this.handleAuthForm.bind(this)} />)} />
                        <Route path="/login" render={() => (<Form handleAuth={this.handleAuthForm.bind(this)} />)} />
                        <Protected_container isAuthenticated={this.state.isUserLoggedIn}>
                            <Sidebar />
                            <Main_content>
                                <Switch>
                                    <Route exact path="/" render={() => (<Redirect to="/timer" />)} />
                                    <Route path="/timer" render={() => (<Timer state={this.state} handleClick={this.handleClick.bind(this)} handleRemove={this.deleteEntry.bind(this)} />)} />
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

export default App;