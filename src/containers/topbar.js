import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import ProjectDropdown from '../components/projectdropdown';
import Icon from '../components/icon';

const Task_controller = styled.section`
    border:1px solid #eee;
    border-width:0 0 2px 0;
    display:flex;
    padding:1rem;
    justify-content:space-between;
    align-items:center;
    position:fixed;
    z-index:50;
    background-color:#fff;
    width:95%;
    height:75px;
@media only screen and (min-width:1024px){
    width:calc(100% - 170px);
}
`;

const Task_timing = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const Task_timing_inner = styled.div`
    display: flex;
    align-items: center;
    width: 11rem;
    margin-left:2rem;
    margin-right:.5rem;
    justify-content: space-between;
`;

const Task_description = styled.input`
    outline-color:transparent;
    flex:1 1 50%;
    padding:.3rem;
    border:none;
    font-size:18px;
`;

const Task_timer = styled.span`
`;

const Settings_section = styled.nav`
    display:flex;
    flex-direction:column;
`;

const Task_options = styled.div`
    width:18px;
    margin-left:-.5rem;
`;

const Task_button = styled.a`
    cursor:pointer;
    color:white;
    background-color:${props => props.isRunning ? 'red' : '#4bc800;'};
    border-radius:50%;
    padding:.3rem;
    display:flex;
    justify-content:center;
    align-items:center;
`;

const Color_indicator = styled.span`
    display:inline-block;
    width:.6rem;
    height:.6rem;
    background-color:${props => '#' + props.color};
    border-radius:50%;
    margin-right:.5rem;
`;

const Item_link = styled.a`
    cursor:pointer;
    display:flex;
    align-items:center;
`;

const Span_relative = styled.span`
    position: relative;
`;

const dropdownStyle = { top: 25, left: '-4rem' };

class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            isTimerModeManual: false,
            isMenuOpen: false
        }
    }

    componentDidMount() {
        this.props.onRef(this);
        this.setState({ description: this.props.runningEntryDescription });
    }

    componentWillReceiveProps(nextP) {
        const { runningEntryDescription } = this.props;

        if (nextP.runningEntryDescription !== runningEntryDescription) this.setState({ description: nextP.runningEntryDescription });
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    setStateWithRef(val) {
        this.setState({ description: val });
    }

    handleClick = () => {
        const { isRunning, createNewEntry, userData, runningEntryDescription,
            currentProject, billable } = this.props;

        if (!isRunning) {
            const params = { description: runningEntryDescription, billable };
            if (currentProject) params.project = currentProject.name;

            createNewEntry(userData._id, params);
        }
        else this.stopTimer();
    }

    stopTimer = () => {
        const { userData, toggleTimer, runningEntry, updateEntry, runningEntryDescription,
            setRunningEntryDescription, getWeekTime, setWeekTimer, currentProject,
            setProject, billable } = this.props;

        const now = moment().valueOf();
        const payload = {
            stop: now,
            description: runningEntryDescription,
            project: (currentProject && currentProject.name) ? currentProject.name : '',
            billable
        };

        toggleTimer(false);
        updateEntry(userData._id, runningEntry, payload);
        setWeekTimer(getWeekTime(userData.entries));
        setRunningEntryDescription('');
        setProject(null);
        this.setState({ description: '' });
    }

    removeStartedEntry = () => {
        const { removeEntry, toggleTimer, userData, runningEntry, setProject, setRunningEntry } = this.props;

        removeEntry(userData._id, runningEntry);
        toggleTimer(false);
        setProject(null);
        setRunningEntry(null);
    }

    changeDescription = (description, runningEntry, previousDescription, enableEmptyInput = false) => {
        const { userData, updateEntry } = this.props;

        if (!runningEntry) runningEntry = this.props.runningEntry;
        console.log('change desc', description);

        const descrCandidate = description.trim();
        if (((descrCandidate !== previousDescription) && runningEntry) || (enableEmptyInput && runningEntry)) {
            updateEntry(userData._id, runningEntry, { description: descrCandidate });
        }
    }

    setProjectState = obj => {
        const { updateEntry, setProject, userData, runningEntry } = this.props;

        if (runningEntry) updateEntry(userData._id, runningEntry, { project: obj ? obj.name : '' });
        setProject(obj);
        this.setState({ isMenuOpen: false });
    }

    setBillable = () => {
        const { runningEntry, updateEntry, userData, billable, setBillable } = this.props;

        setBillable(!billable);
        runningEntry && updateEntry(userData._id, runningEntry, { billable: !billable });
    }

    setRunningDescription = e => {
        const { updateEntry, setRunningEntryDescription, userData, runningEntry } = this.props;

        updateEntry(userData._id, runningEntry, { description: e.target.value });
        setRunningEntryDescription(e.target.value);
    }

    setDescriptionState = e => {
        this.setState({ description: e.target.value });
    }

    openMenu = () => {
        this.setState({ isMenuOpen: true });
    }

    render() {
        const { isRunning, timer, setRunningEntryDescription, userData, currentProject, billable } = this.props;
        const { description, isTimerModeManual } = this.state;

        return (
            <Task_controller>
                <Task_description
                    type="text"
                    placeholder={isRunning ? '(no description)' : 'What are you working on?'}
                    value={description} onChange={this.setDescriptionState}
                    onBlur={this.setRunningDescription} />
                <Task_timing>
                    <Span_relative onClick={this.openMenu}>
                        {currentProject &&
                            <Item_link>
                                <Color_indicator color={currentProject.color} />
                                <span>{currentProject.name}</span>
                            </Item_link>}
                        {!currentProject &&
                            <Item_link>
                                <Icon name="folder" fill="#bbb" size="20px" />
                            </Item_link>}
                        <ProjectDropdown setProjectState={this.setProjectState} userData={userData} style={dropdownStyle}
                            isOpen={this.state.isMenuOpen} setParentState={this.setState.bind(this)} />
                    </Span_relative>
                    <Task_timing_inner>
                        <Item_link onClick={this.setBillable}>
                            <Icon name="attach_money" size='20px' fill={billable ? 'green' : '#bbb'} />
                        </Item_link>
                        <Task_timer>{timer}</Task_timer>
                        <Task_button isRunning={isRunning} onClick={this.handleClick}>
                            <Icon name={isRunning ? "stop" : "play_arrow"} />
                        </Task_button>
                        <Task_options>
                            {isRunning && <Item_link onClick={this.removeStartedEntry}>
                                <Icon name="delete" fill="#bbb" size="16px" />
                            </Item_link>}
                        </Task_options>
                    </Task_timing_inner>
                </Task_timing>
            </Task_controller >
        );
    }
}

const mapStateToProps = ({ global, entry, timer, user }) => ({
    isRunning: global.isRunning,
    userData: user.userData,
    runningEntry: entry.runningEntry,
    timer: timer.timer,
    billable: entry.billable,
    weekTimer: timer.weekTimer,
    currentProject: entry.currentProject,
    runningEntryDescription: entry.runningEntryDescription
});

const mapDispatchToProps = dispatch => ({
    setIsRunning: bool => dispatch(actions.global.setIsRunning(bool)),
    setTimer: str => dispatch(actions.timer.setTimer(str)),
    toggleTimer: (bool, val) => dispatch(actions.timer.toggleTimer(bool, val)),
    setWeekTimer: str => dispatch(actions.timer.setWeekTimer(str)),
    setProject: obj => dispatch(actions.entry.setProject(obj)),
    setBillable: v => dispatch(actions.entry.setBillable(v)),
    setRunningEntry: v => dispatch(actions.entry.setRunningEntry(v)),
    setRunningEntryDescription: v => dispatch(actions.entry.setRunningEntryDescription(v)),
    createNewEntry: (userid, obj) => dispatch(actions.entry.createNewEntry(userid, obj)),
    updateEntry: (userid, runningEntry, obj) => dispatch(actions.entry.updateEntry(userid, runningEntry, obj)),
    removeEntry: (uid, eid) => dispatch(actions.entry.removeEntry(uid, eid))
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);