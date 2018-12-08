import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import * as actions from '../actions';

class Protected_container extends React.Component {
    constructor() {
        super();
        this.handleVisibility = this.handleVisibility.bind(this);
    }

    componentDidMount() {
        const { location, history, isUserLoggedIn } = this.props;

        document.addEventListener('visibilitychange', this.handleVisibility);

        if (!isUserLoggedIn && location.pathname.slice(1).toLowerCase() !== 'signup') history.push('/login');
        this.setPreviouslyRunningTimer();
    }

    componentWillUnmount() {
        document.removeEventListener('visibilitychange', this.handleVisibility);
    }

    shouldComponentUpdate(nextP, nextS) {
        if (this.props.entries !== nextP.entries) return false;
        return true;
    }

    handleVisibility = () => {
        if (document.hidden) {
            this.props.setIsTabActive(false);
        }
        else {
            this.props.setIsTabActive(true);
        }
    }

    setPreviouslyRunningTimer = () => {
        const { entries, projects, setRunningEntry, setRunningEntryDescription,
            setProject, toggleTimer, setBillable } = this.props;

        if (!entries || !entries.length) return null;

        const entryThatStillRuns = entries.find(itm => !itm.stop);

        if (entryThatStillRuns) {
            const start = entryThatStillRuns.start;

            setRunningEntry(entryThatStillRuns._id);
            setProject(projects.filter(itm => itm.name === entryThatStillRuns.project)[0]);
            toggleTimer(true, start);
            setRunningEntryDescription(entryThatStillRuns.description || '');
            entryThatStillRuns.billable && setBillable(true);
        }
    }

    render() {
        const { isUserLoggedIn, hasErrored, children } = this.props;
        const path = this.props.location.pathname.toLowerCase();

        return (isUserLoggedIn) ? children :
            ((hasErrored || path === '/login' || path === '/signup') ? null : <Redirect to="/login" />);
    }
}

const mapStateToProps = ({ global, user }) => ({
    isUserLoggedIn: global.isUserLoggedIn,
    hasErrored: global.hasErrored,
    userData: user.userData,
    entries: user.entries,
    projects: user.projects
});

const mapDispatchToProps = dispatch => ({
    setBillable: (bool) => dispatch(actions.entry.setBillable(bool)),
    setIsRunning: bool => dispatch(actions.global.setIsRunning(bool)),
    setTimer: str => dispatch(actions.timer.setTimer(str)),
    toggleTimer: (bool, val) => dispatch(actions.timer.toggleTimer(bool, val)),
    setProject: obj => dispatch(actions.entry.setProject(obj)),
    setBillable: v => dispatch(actions.entry.setBillable(v)),
    setIsTabActive: v => dispatch(actions.global.setIsTabActive(v)),
    setRunningEntry: v => dispatch(actions.entry.setRunningEntry(v)),
    setRunningEntryDescription: v => dispatch(actions.entry.setRunningEntryDescription(v))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Protected_container));