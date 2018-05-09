import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import * as actions from '../actions';

class Protected_container extends React.Component {
    componentDidMount() {
        const { location, history, isUserLoggedIn, userData } = this.props;

        if (!isUserLoggedIn && location.pathname.slice(1).toLowerCase() !== 'signup') history.push('/login');
        else this.setPreviouslyRunningTimer(userData);
    }

    setPreviouslyRunningTimer = userData => {
        const { setRunningEntry, setIsRunning, setTimer, setRunningEntryDescription,
            setProject, toggleTimer, setBillable } = this.props;

        if (!userData.entries || !userData.entries.length) return null;

        let runEntry = userData.entries.filter(item => item.stop === undefined);
        if (runEntry.length) {
            runEntry = runEntry[0];
            const start = moment(runEntry.start).format();

            setRunningEntry(runEntry._id);
            setProject(userData.projects.filter(itm => itm.name === runEntry.project)[0]);
            toggleTimer(true, start);
            setRunningEntryDescription(runEntry.description || '');
            if (runEntry.billable) setBillable(true);
        }
    }

    render() {
        const { isUserLoggedIn, children } = this.props;
        const path = this.props.location.pathname.toLowerCase();

        return (isUserLoggedIn) ? children : ((path === '/login' || path === '/signup') ? null : <Redirect to="/login" />);
    }
}
const mapStateToProps = ({ global, user }) => ({
    isUserLoggedIn: global.isUserLoggedIn,
    userData: user.userData
});

const mapDispatchToProps = dispatch => ({
    setBillable: (bool) => dispatch(actions.entry.setBillable(bool)),
    setIsRunning: bool => dispatch(actions.global.setIsRunning(bool)),
    setTimer: str => dispatch(actions.timer.setTimer(str)),
    toggleTimer: (bool, val) => dispatch(actions.timer.toggleTimer(bool, val)),
    setProject: obj => dispatch(actions.entry.setProject(obj)),
    setBillable: v => dispatch(actions.entry.setBillable(v)),
    setRunningEntry: v => dispatch(actions.entry.setRunningEntry(v)),
    setRunningEntryDescription: v => dispatch(actions.entry.setRunningEntryDescription(v))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Protected_container));