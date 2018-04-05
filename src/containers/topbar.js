import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import * as actions from '../actions';
import Icon from '../components/icon';

const Task_controller = styled.section`
    border:2px solid #ccc;
    border-width:0 0 2px 0;
    display:flex;
    padding:1rem;
    justify-content:space-between;
    align-items:center;
    position:fixed;
    background-color:#fff;
    width:95%;
@media only screen and (min-width:1200px){
    width:91%;
}
`;

const Task_timing = styled.div`
    min-width:15rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
`;

const Task_description = styled.input`
`;

const Task_timer = styled.span`
`;

const Task_button = styled.a`
    cursor:pointer;
    color:white;
    background-color:${props => props.isRunning ? 'red' : 'green'};
    border-radius:50%;
    padding:.3rem;
    display:flex;
    justify-content:center;
    align-items:center;
`;

class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            description: ''
        }
    }

    componentDidMount() {
        this.props.onRef(this);

        this.setPreviouslyRunningTimer(this.props.userData);
        console.log('TOPBAR JUST MOUNTED');
    }

    componentWillUnmount() {
        if (window.interval) clearInterval(window.interval);
        this.props.onRef(null);
    }

    setPreviouslyRunningTimer(userData) {
        const { setRunningEntry, isRunning, setIsRunning, setTimer, setRunningEntryDescription } = this.props;

        //await this.props.fetchEntries(this.props.userData._id);

        console.log('mounted', userData.entries.filter(item => item.stop === undefined).length);

        if (userData.entries.filter(item => item.stop === undefined).length) {
            const runEntry = userData.entries.filter(item => item.stop === undefined)[0];
            setRunningEntry(runEntry._id);
            console.log('mounted2');

            const start = moment(runEntry.start).format();

            setIsRunning(true);
            clearInterval(window.interval);
            window.interval = setInterval(() => {
                const time = moment.duration(moment().diff(start)).format('h:mm:ss', { stopTrim: "hh mm ss" });
                setTimer(time);
            }, 500);

            setRunningEntryDescription(runEntry.description || '');
            this.setState({ description: runEntry.description || '' });
        }
    }

    setStateWithRef(val) {
        this.setState({ description: val });
    }

    handleClick() {
        const { isRunning, createNewEntry, userData, toggleTimer, runningEntryDescription } = this.props;

        if (!isRunning) {
            toggleTimer(true);
            createNewEntry(userData._id, 'description', runningEntryDescription);
        }
        else this.stopTimer();
    }

    stopTimer() {
        const { userData, toggleTimer, runningEntry, updateEntry, runningEntryDescription, setRunningEntryDescription } = this.props;
        const now = moment().valueOf();

        toggleTimer(false);
        //console.log(this.input.value);
        updateEntry(userData._id, runningEntry, { stop: now, description: runningEntryDescription });
        setRunningEntryDescription('');
        this.setState({ description: '' });
    }

    changeDescription(description, runningEntry, previousDescription, enabLeEmptyInput = false) {
        const { userData, updateEntry } = this.props;
        if (!runningEntry) runningEntry = this.props.runningEntry;
        console.log('change desc', description);

        if (((description.trim() !== previousDescription) && runningEntry) || (enabLeEmptyInput && runningEntry)) {
            updateEntry(userData._id, runningEntry, { description: description.trim() });
        }
    }

    render() {
        const { isRunning, timer, runningEntryDescription, setRunningEntryDescription } = this.props;

        return (
            <Task_controller>
                <Task_description
                    type="text"
                    placeholder={isRunning ? '(no description)' : 'What are you working on?'}
                    // defaultValue={runningEntryDescription}
                    value={this.state.description}
                    onChange={e => this.setState({ description: e.target.value })}
                    onBlur={e => setRunningEntryDescription(e.target.value)} />
                <Task_timing>
                    <span>no project</span>
                    <span><Icon name="attach_money" /></span>
                    <Task_timer>{timer}</Task_timer>
                    <Task_button isRunning={isRunning} onClick={() => this.handleClick()}>
                        <Icon name={isRunning ? "stop" : "play_arrow"} />
                    </Task_button>
                </Task_timing>
            </Task_controller>
        );
    }
}

const mapStateToProps = ({ isRunning, timer, userData, runningEntry, runningEntryDescription }) => ({
    isRunning,
    userData,
    runningEntry,
    timer,
    runningEntryDescription
});

const mapDispatchToProps = dispatch => ({
    setIsRunning: bool => dispatch(actions.setIsRunning(bool)),
    setTimer: str => dispatch(actions.setTimer(str)),
    toggleTimer: bool => dispatch(actions.toggleTimer(bool)),
    fetchEntries: id => dispatch(actions.fetchEntries(id)),
    setRunningEntry: v => dispatch(actions.setRunningEntry(v)),
    setRunningEntryDescription: v => dispatch(actions.setRunningEntryDescription(v)),
    createNewEntry: (userid, param, pval) => dispatch(actions.createNewEntry(userid, param, pval)),
    updateEntry: (userid, runningEntry, obj) => dispatch(actions.updateEntry(userid, runningEntry, obj))
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);